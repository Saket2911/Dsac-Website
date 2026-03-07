import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import apiRouter from "./routes/apiRouter.js";
import { startDailyQuestionJob } from "./cronJobs/dailyQuestionCron.js";

import connectDB from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

await connectDB();

// Start cron jobs (daily question generation + auto-detect solvers)
startDailyQuestionJob();

const app = express();

// Production Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin images (uploads)
}));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: true, // In production, you should specify the actual domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Static Files
app.use("/uploads", express.static(uploadsDir));

// Routes
// All functional routes are consolidated under /api for frontend compatibility and organizational clarity
app.use("/api", apiRouter);


// Root Health Check
app.get("/", (req, res) => {
  res.json({ message: "DSAC Backend API is running", version: "1.0.0" });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500
    }
  });
});

const port = process.env.PORT || 3001;
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

export default app;