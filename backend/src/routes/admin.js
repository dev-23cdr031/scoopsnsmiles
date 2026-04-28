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

async function getCloudMlInsights({ days, limit }) {
  const baseUrl = String(process.env.ML_API_BASE_URL || "").trim().replace(/\/$/, "");
  if (!baseUrl) {
    return null;
  }

  const query = new URLSearchParams({
    days: String(days),
    n: String(Math.max(1, Math.min(limit, 10)))
  });

  const [healthRes, planRes, sellersRes] = await Promise.all([
    fetch(`${baseUrl}/api/health`),
    fetch(`${baseUrl}/api/production-plan?${query.toString()}`),
    fetch(`${baseUrl}/api/bestsellers`)
  ]);

  if (!healthRes.ok || !planRes.ok || !sellersRes.ok) {
    throw new Error("ML service request failed");
  }

  const health = await healthRes.json();
  const production = await planRes.json();
  const bestsellers = await sellersRes.json();

  const plan = Array.isArray(production?.plan) ? production.plan : [];
  const rankings = Array.isArray(bestsellers?.rankings) ? bestsellers.rankings : [];
  const totalPredicted = plan.reduce(
    (sum, row) => sum + Number(row?.recommended_production || 0),
    0
  );

  return {
    generatedAt: new Date().toISOString(),
    dataset: {
      source: "external-ml-api",
      mode: "cloud",
      filePath: null,
      records: 0,
      products: rankings.length,
      startDate: null,
      endDate: null,
      catalogCoverage: {
        matchedProducts: rankings.length,
        totalCatalogProducts: rankings.length,
        ratio: 1
      }
    },
    model: {
      name: "CloudMlModel",
      type: "external-service",
      features: [],
      mae: 0,
      rmse: 0,
      r2: 0,
      health
    },
    bestSellers: rankings.map((item, index) => ({
      rank: Number(item?.rank || index + 1),
      productId: Number(item?.product_id || item?.id || index + 1),
      productName: String(item?.product_name || item?.name || "Unknown"),
      category: String(item?.category || "unknown"),
      totalUnits: Number(item?.total_sold || item?.units || 0),
      totalRevenue: Number(item?.revenue || item?.total_revenue || 0),
      avgDailyUnits: Number(item?.avg_daily || 0),
      trendScore: Number(item?.trend_score || 0),
      trend: String(item?.trend || "stable")
    })),
    demand: {
      forecasts: plan.map((item, index) => ({
        productId: Number(item?.product_id || item?.id || index + 1),
        productName: String(item?.product_name || item?.name || "Unknown"),
        category: String(item?.category || "unknown"),
        rank: index + 1,
        avgDailyPrediction: Number(item?.recommended_production || 0),
        predictedPeriodTotal: Number(item?.recommended_production || 0),
        demandConfidenceBand: {
          low: Math.max(0, Number(item?.recommended_production || 0) - 2),
          high: Number(item?.recommended_production || 0) + 2
        },
        nextDays: []
      })),
      overallForecast: [
        {
          date: new Date().toISOString().slice(0, 10),
          predictedUnits: totalPredicted
        }
      ],
      topDemandProducts: plan
        .map((item, index) => ({
          productId: Number(item?.product_id || item?.id || index + 1),
          productName: String(item?.product_name || item?.name || "Unknown"),
          category: String(item?.category || "unknown"),
          rank: index + 1,
          avgDailyPrediction: Number(item?.recommended_production || 0),
          predictedPeriodTotal: Number(item?.recommended_production || 0),
          demandConfidenceBand: {
            low: Math.max(0, Number(item?.recommended_production || 0) - 2),
            high: Number(item?.recommended_production || 0) + 2
          },
          nextDays: []
        }))
        .sort((a, b) => b.predictedPeriodTotal - a.predictedPeriodTotal)
        .slice(0, 5)
    }
  };
}

router.get("/admin/ml/insights", async (req, res) => {
  const days = Number(req.query.days || 7);
  const limit = Number(req.query.limit || 8);
  const refresh = String(req.query.refresh || "false").toLowerCase() === "true";

  try {
    const cloudInsights = await getCloudMlInsights({ days, limit });
    if (cloudInsights) {
      return res.json(cloudInsights);
    }

    const insights = getAdminMlInsights({ days, limit, refresh });
    return res.json(insights);
  } catch (error) {
    return res.status(502).json({
      message: "Failed to fetch ML insights",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
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
