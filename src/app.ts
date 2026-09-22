import express, { Express } from "express";
import productRoutes from "./routes/product.routes";

export function createApp(): Express {
  const app = express();

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/products", productRoutes);

  return app;
}
