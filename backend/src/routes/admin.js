import { Router } from "express";
import pool from "../db/connection.js";
import { getAdminMlInsights } from "../services/adminMlService.js";

const router = Router();
const ORDER_STATUSES = new Set([
  "confirmed",
  "preparing",
  "baking",
  "ready",
  "out-for-delivery",
  "delivered"
]);

function toCategoryLabel(categoryId) {
  return String(categoryId)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

router.get("/admin/ml/insights", (req, res) => {
  const days = Number(req.query.days || 7);
  const limit = Number(req.query.limit || 8);
  const refresh = String(req.query.refresh || "false").toLowerCase() === "true";
  const insights = getAdminMlInsights({ days, limit, refresh });
  res.json(insights);
});

router.post("/admin/products", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const category = String(req.body?.category || "").trim().toLowerCase();
  const price = Number(req.body?.price || 0);
  const image = String(req.body?.image || "").trim();
  const description = String(req.body?.description || "").trim();
  const featured = req.body?.featured ? 1 : 0;
  const badge = String(req.body?.badge || "").trim();

  if (!name || !category || price <= 0 || !image || !description) {
    return res.status(400).json({
      message: "name, category, price, image and description are required"
    });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO products (name, category, price, image, description, featured, badge) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, category, Math.round(price), image, description, featured, badge]
    );
    const id = result.insertId;

    const [catRows] = await pool.query("SELECT id FROM categories WHERE id = ?", [category]);
    if (catRows.length === 0) {
      await pool.query("INSERT INTO categories (id, name, icon) VALUES (?, ?, 'cart')", [
        category,
        toCategoryLabel(category)
      ]);
    }

    const product = { id, name, category, price: Math.round(price), image, description, featured: featured === 1, badge };
    return res.status(201).json({ message: "Product created", product });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

router.delete("/admin/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
    return res.json({ message: "Product deleted", product: { ...rows[0], featured: rows[0].featured === 1 } });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

router.get("/admin/orders", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM orders ORDER BY order_id DESC");
    const orders = await Promise.all(
      rows.map(async (row) => {
        const [itemRows] = await pool.query(
          "SELECT item_text FROM order_items WHERE order_id = ?",
          [row.order_id]
        );
        return {
          orderId: row.order_id,
          status: row.status,
          items: itemRows.map((i) => i.item_text),
          totalAmount: row.total_amount,
          orderDate: row.order_date,
          estimatedDelivery: row.estimated_delivery,
          customerName: row.customer_name,
          phone: row.phone,
          address: row.address,
          note: row.note
        };
      })
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

router.patch("/admin/orders/:orderId/status", async (req, res) => {
  const orderId = String(req.params.orderId || "").trim().toUpperCase();
  const status = String(req.body?.status || "").trim();

  if (!ORDER_STATUSES.has(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM orders WHERE order_id = ?", [orderId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    await pool.query("UPDATE orders SET status = ? WHERE order_id = ?", [status, orderId]);
    const [itemRows] = await pool.query(
      "SELECT item_text FROM order_items WHERE order_id = ?",
      [orderId]
    );
    const order = {
      orderId: rows[0].order_id,
      status,
      items: itemRows.map((i) => i.item_text),
      totalAmount: rows[0].total_amount,
      orderDate: rows[0].order_date,
      estimatedDelivery: rows[0].estimated_delivery,
      customerName: rows[0].customer_name
    };
    return res.json({ message: "Order status updated", order });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

export default router;
