import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ Get all industries
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT indus_id, indus_name
       FROM du_job_industry
       WHERE is_active = true
       ORDER BY indus_name ASC`
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching industries:", error);
    return NextResponse.json({ error: "Failed to fetch industries" }, { status: 500 });
  }
}
