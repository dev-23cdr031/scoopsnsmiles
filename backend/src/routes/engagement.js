import { Router } from "express";
import {
  contactRequests,
  demoOrders,
  newsletterSubscriptions
} from "../data/store.js";

const router = Router();

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
