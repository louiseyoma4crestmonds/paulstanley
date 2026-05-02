import pkg from "pg";
const { Pool } = pkg;
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });

// Optional: test connection
(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Connected to PostgreSQL at", result.rows[0].now);
  } catch (err:any) {
    console.error("❌ Database connection failed:", err.message);
  }
})();
