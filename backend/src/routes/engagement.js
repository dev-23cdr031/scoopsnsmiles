import { Router } from "express";
import {
  contactRequests,
  demoOrders,
  newsletterSubscriptions
} from "../data/store.js";

const router = Router();

function buildNextOrderId() {
  const year = new Date().getFullYear();
  const pattern = new RegExp(`^SB-${year}-(\\d{4})$`);
  let maxSequence = 0;

  Object.keys(demoOrders).forEach((key) => {
    const match = key.match(pattern);
    if (match) {
      maxSequence = Math.max(maxSequence, Number(match[1]));
    }
  });

  const nextSequence = String(maxSequence + 1).padStart(4, "0");
  return `SB-${year}-${nextSequence}`;
}

router.post("/orders", (req, res) => {
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

  const orderId = buildNextOrderId();
  const now = new Date();
  const eta = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  const order = {
    orderId,
    status: "confirmed",
    items: normalizedItems.map((item) => `${item.name} x${item.quantity}`),
    totalAmount: Math.round(totalAmount),
    orderDate: now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }),
    estimatedDelivery: eta.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }),
    customerName,
    phone,
    address,
    note
  };

  demoOrders[orderId] = order;

  return res.status(201).json({
    message: "Order placed successfully",
    orderId,
    order
  });
});

router.get("/orders", (req, res) => {
  const limit = Math.max(1, Math.min(50, Number(req.query.limit || 20)));
  const orders = Object.values(demoOrders)
    .sort((a, b) => b.orderId.localeCompare(a.orderId))
    .slice(0, limit);

  return res.json(orders);
});

router.get("/orders/:orderId", (req, res) => {
  const normalizedOrderId = String(req.params.orderId).trim().toUpperCase();
  const order = demoOrders[normalizedOrderId];

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  return res.json(order);
});

router.post("/newsletter", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "A valid email is required" });
  }

  const exists = newsletterSubscriptions.some((item) => item.email === email);
  if (!exists) {
    newsletterSubscriptions.push({
      email,
      subscribedAt: new Date().toISOString()
    });
  }

  return res.status(201).json({
    message: "Subscription created",
    alreadySubscribed: exists
  });
});

router.post("/contact", (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const subject = String(req.body?.subject || "").trim();
  const message = String(req.body?.message || "").trim();

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "name, email, subject and message are required" });
  }

  const ticketId = `CT-${Date.now()}`;
  contactRequests.push({
    ticketId,
    name,
    email,
    subject,
    message,
    receivedAt: new Date().toISOString()
  });

  return res.status(201).json({
    message: "Contact request received",
    ticketId
  });
});

export default router;
