import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

// Create a pool of reusable database connections
const connectionPool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME ?? "taskboard",
  max: Number(process.env.DB_POOL_MAX ?? 10),
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT ?? 30000),
});

connectionPool.on("error", (err) => {
  console.error("Database connection pool error:", err.message);
});

export default connectionPool;
