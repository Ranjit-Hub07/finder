import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("recruiter_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const recruiterId = decoded.recruiter_id;

    if (!recruiterId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const query = `
      SELECT status, COUNT(*) as count
      FROM jobs
      WHERE user_id = $1
      GROUP BY status
    `;

    const result = await pool.query(query, [recruiterId]);

    // ✅ Default structure
    const summary = { open: 0, paused: 0, closed: 0 };

    result.rows.forEach((row) => {
      if (!row.status) return;

      const key = row.status.toLowerCase().trim();
      if (summary[key] !== undefined) {
        summary[key] = parseInt(row.count, 10);
      }
    });

    return NextResponse.json(summary);

  } catch (err) {
    console.error("❌ Error fetching job summary:", err);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
