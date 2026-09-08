import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { plan_id } = await req.json();
    if (!plan_id) {
      return NextResponse.json(
        { message: "Plan ID is required" },
        { status: 400 }
      );
    }

    // ✅ Fetch plan
    const planResult = await query(
      `SELECT id, price_inr, duration_days 
       FROM plans 
       WHERE id = $1`,
      [plan_id]
    );

    if (planResult.rows.length === 0) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 });
    }

    const plan = planResult.rows[0];
    const durationDays = Number(plan.duration_days) || 0;
    const totalAmount = Number(plan.price_inr) || 0;
    const gstAmount = Math.round(totalAmount * 0.18);

    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + durationDays);

    // ✅ TRANSACTION SAFE
    await query("BEGIN");

    // ✅ Expire old active plan
    await query(
      `UPDATE subscriptions 
       SET status = 'expired'
       WHERE user_numeric_id = $1 AND status = 'active'`,
      [user.id]
    );

    // ✅ Insert new active plan
    const insertResult = await query(
      `INSERT INTO subscriptions
        (user_numeric_id, plan_id, status, started_at, expires_at, total_amount, gst_amount)
       VALUES ($1, $2, 'active', $3, $4, $5, $6)
       RETURNING *`,
      [user.id, plan_id, start, end, totalAmount, gstAmount]
    );

    await query("COMMIT");

    return NextResponse.json({
      message: "Subscription Activated Successfully",
      subscription: insertResult.rows[0],
    });
  } catch (error) {
    await query("ROLLBACK");
    console.error("Subscription Activation Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
