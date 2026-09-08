import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

let pool;

if (!global._pgPool) {
  const hasValidDatabaseUrl =
    process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes("YOUR_PROJECT_REF") &&
    !process.env.DATABASE_URL.includes("YOUR_PASSWORD");

  if (process.env.DATABASE_URL && !hasValidDatabaseUrl) {
    console.warn(
      "[db] Warning: DATABASE_URL contains placeholder 'YOUR_PROJECT_REF'. Falling back to local PostgreSQL config."
    );
  }

  const poolConfig = hasValidDatabaseUrl
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      }
    : {
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "job_portal",
        password: process.env.DB_PASSWORD || "ranjit@2003",
        port: parseInt(process.env.DB_PORT || "5432"),
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      };

  global._pgPool = new Pool(poolConfig);
}

pool = global._pgPool;

export default pool;

export async function query(text, params) {
  return pool.query(text, params);
}
