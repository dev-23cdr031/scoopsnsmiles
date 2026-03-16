import cors from "cors";
import express from "express";
import adminRoutes from "./routes/admin.js";
import catalogRoutes from "./routes/catalog.js";
import engagementRoutes from "./routes/engagement.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: frontendOrigin.split(",").map((origin) => origin.trim())
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    service: "sakthi-bakers-backend",
    status: "running",
    docs: {
      health: "/api/health",
      products: "/api/products",
      offers: "/api/offers",
      giftCards: "/api/gift-cards",
      orderTrackingExample: "/api/orders/SB-2026-0001",
      adminMlInsights: "/api/admin/ml/insights"
    }
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", catalogRoutes);
app.use("/api", engagementRoutes);
app.use("/api", adminRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    tip: "Use / for service info or /api/health for health check"
  });
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
