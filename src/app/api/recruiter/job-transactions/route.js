import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function GET() {
  try {
    // ✅ READ COOKIE SAFELY
    const cookieStore = await cookies();
    const token = cookieStore.get("recruiter_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const recruiterId = decoded?.recruiter_id;
    if (!recruiterId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // ✅ FETCH ONLY THIS RECRUITER'S TRANSACTIONS
    const query = `
      SELECT 
        s.id,
        s.payment_id AS txn_id,
        s.payment_mode,
        s.status AS transaction_status,
        s.created_at AS transaction_date,
        s.total_amount,
        s.gst_amount,
        p.name AS plan_name,
        p.price_inr
      FROM subscriptions s
      JOIN plans p ON p.id = s.plan_id
      WHERE s.user_numeric_id = $1
      ORDER BY s.created_at DESC;
    `;

    const result = await pool.query(query, [recruiterId]);

    return NextResponse.json({
      transactions: result.rows,
    });

  } catch (error) {
    console.error("Transaction Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
