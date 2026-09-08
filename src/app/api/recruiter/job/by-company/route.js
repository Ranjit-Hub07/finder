import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const company = searchParams.get("company");

    if (!company) {
      return NextResponse.json({ success: false, message: "Company name required" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT * FROM jobs WHERE job_company ILIKE $1 AND is_active = true AND is_delete = false ORDER BY created_at DESC`,
      [company]
    );

    return NextResponse.json({ success: true, jobs: result.rows });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
