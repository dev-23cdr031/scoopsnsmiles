import { Router } from "express";
import { categories, demoOrders, products } from "../data/store.js";
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

function nextProductId() {
  return products.reduce((maxId, product) => Math.max(maxId, Number(product.id) || 0), 0) + 1;
}

router.get("/admin/ml/insights", (req, res) => {
  const days = Number(req.query.days || 7);
  const limit = Number(req.query.limit || 8);
  const refresh = String(req.query.refresh || "false").toLowerCase() === "true";

  const insights = getAdminMlInsights({ days, limit, refresh });
  res.json(insights);
});

router.post("/admin/products", (req, res) => {
  const name = String(req.body?.name || "").trim();
  const category = String(req.body?.category || "").trim().toLowerCase();
  const price = Number(req.body?.price || 0);
  const image = String(req.body?.image || "").trim();
  const description = String(req.body?.description || "").trim();
  const featured = Boolean(req.body?.featured);
  const badge = String(req.body?.badge || "").trim();

  if (!name || !category || price <= 0 || !image || !description) {
    return res.status(400).json({
      message: "name, category, price, image and description are required"
    });
  }

  const product = {
    id: nextProductId(),
    name,
    category,
    price: Math.round(price),
    image,
    description,
    featured,
    badge
  };

  products.push(product);

  const hasCategory = categories.some((item) => item.id === category);
  if (!hasCategory) {
    categories.push({
      id: category,
      name: toCategoryLabel(category),
      icon: "cart"
    });
  }

  return res.status(201).json({
    message: "Product created",
    product
  });
});

router.delete("/admin/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const productIndex = products.findIndex((item) => item.id === id);

  if (productIndex < 0) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  const [removed] = products.splice(productIndex, 1);

  return res.json({
    message: "Product deleted",
    product: removed
  });
});

router.get("/admin/orders", (_req, res) => {
  const orders = Object.values(demoOrders).sort((a, b) => b.orderId.localeCompare(a.orderId));
  res.json(orders);
});

router.patch("/admin/orders/:orderId/status", (req, res) => {
  const orderId = String(req.params.orderId || "").trim().toUpperCase();
  const status = String(req.body?.status || "").trim();

  if (!ORDER_STATUSES.has(status)) {
    return res.status(400).json({
      message: "Invalid status"
    });
  }

  const order = demoOrders[orderId];
  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  order.status = status;

  return res.json({
    message: "Order status updated",
    order
  });
});

export default router;
