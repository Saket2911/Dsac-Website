import type { Express } from "express";
import { type Server } from "http";
import apiRouter from "./routes/apiRouter.js";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Mount all API routes under /api
  app.use("/api", apiRouter);

  return httpServer;
}
