import apiRouter from "./routes/apiRouter.js";
export async function registerRoutes(httpServer, app) {
  // Mount all API routes under /api
  app.use("/api", apiRouter);
  return httpServer;
}
