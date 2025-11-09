import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pool from "./configuration/database.js";
import taskRoutes from "./routes/taskRoutes.js";
import requestLogger from "./middleware/logger.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// ---------- Routes ----------
app.use("/api/tasks", taskRoutes);

// Health check endpoint
app.get("/health", async (req, res, next) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch (err) {
    next(err);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});
