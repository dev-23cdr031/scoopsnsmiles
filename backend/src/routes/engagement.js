import { Router } from "express";
import pool from "../db/connection.js";

const router = Router();

async function buildNextOrderId() {
  const year = new Date().getFullYear();
  const [rows] = await pool.query(
    "SELECT order_id FROM orders WHERE order_id LIKE ? ORDER BY order_id DESC LIMIT 1",
    [`SB-${year}-%`]
  );
  if (rows.length === 0) return `SB-${year}-0001`;
  const match = rows[0].order_id.match(/SB-\d+-(\d{4})$/);
  const nextSeq = match ? String(Number(match[1]) + 1).padStart(4, "0") : "0001";
  return `SB-${year}-${nextSeq}`;
}

async function rowToOrder(row) {
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
}

router.post("/orders", async (req, res) => {
  const customerName = String(req.body?.customerName || "").trim();
  const phone = String(req.body?.phone || "").trim();
  const address = String(req.body?.address || "").trim();
  const note = String(req.body?.note || "").trim();
  const totalAmount = Number(req.body?.totalAmount || 0);

  const itemsInput = Array.isArray(req.body?.items) ? req.body.items : [];
  const normalizedItems = itemsInput
    .map((item) => ({
      name: String(item?.name || "").trim(),
      quantity: Number(item?.quantity || 0)
    }))
    .filter((item) => item.name && item.quantity > 0);

  if (!customerName || !phone || !address || normalizedItems.length === 0 || totalAmount <= 0) {
    return res.status(400).json({
      message: "customerName, phone, address, valid items and totalAmount are required"
    });
  }

  try {
    const orderId = await buildNextOrderId();
    const now = new Date();
    const eta = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const orderDate = now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
    const estimatedDelivery = eta.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });

    await pool.query(
      `INSERT INTO orders (order_id, status, total_amount, order_date, estimated_delivery, customer_name, phone, address, note)
       VALUES (?, 'confirmed', ?, ?, ?, ?, ?, ?, ?)`,
      [orderId, Math.round(totalAmount), orderDate, estimatedDelivery, customerName, phone, address, note]
    );

    const itemTexts = normalizedItems.map((item) => `${item.name} x${item.quantity}`);
    for (const text of itemTexts) {
      await pool.query("INSERT INTO order_items (order_id, item_text) VALUES (?, ?)", [orderId, text]);
    }

    const order = {
      orderId,
      status: "confirmed",
      items: itemTexts,
      totalAmount: Math.round(totalAmount),
      orderDate,
      estimatedDelivery,
      customerName,
      phone,
      address,
      note
    };

    return res.status(201).json({ message: "Order placed successfully", orderId, order });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

router.get("/orders", async (req, res) => {
  const limit = Math.max(1, Math.min(50, Number(req.query.limit || 20)));
  try {
    const [rows] = await pool.query(
      "SELECT * FROM orders ORDER BY order_id DESC LIMIT ?",
      [limit]
    );
    const orders = await Promise.all(rows.map(rowToOrder));
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

router.get("/orders/:orderId", async (req, res) => {
  const normalizedOrderId = String(req.params.orderId).trim().toUpperCase();
  try {
    const [rows] = await pool.query("SELECT * FROM orders WHERE order_id = ?", [normalizedOrderId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json(await rowToOrder(rows[0]));
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

router.post("/newsletter", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "A valid email is required" });
  }

  try {
    const [existing] = await pool.query(
      "SELECT id FROM newsletter_subscriptions WHERE email = ?",
      [email]
    );
    const alreadySubscribed = existing.length > 0;
    if (!alreadySubscribed) {
      await pool.query("INSERT INTO newsletter_subscriptions (email) VALUES (?)", [email]);
    }
    return res.status(201).json({ message: "Subscription created", alreadySubscribed });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

router.post("/contact", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const subject = String(req.body?.subject || "").trim();
  const message = String(req.body?.message || "").trim();

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "name, email, subject and message are required" });
  }

  try {
    const ticketId = `CT-${Date.now()}`;
    await pool.query(
      "INSERT INTO contact_requests (ticket_id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)",
      [ticketId, name, email, subject, message]
    );
    return res.status(201).json({ message: "Contact request received", ticketId });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

export default router;
