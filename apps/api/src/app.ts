import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import warehouseRoutes from "./routes/warehouses.routes.js";
import crmRoutes from "./routes/crm.routes.js";
import returnsRoutes from "./routes/returns.routes.js";
import accountingRoutes from "./routes/accounting.routes.js";
import saasRoutes from "./routes/saas.routes.js";
import logsRoutes from "./routes/logs.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/crm", crmRoutes);
app.use("/api/returns", returnsRoutes);
app.use("/api/accounting", accountingRoutes);
app.use("/api/saas", saasRoutes);
app.use("/api/logs", logsRoutes);

export default app;
