import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Get active subscription ordered by latest
    const subscriptionResult = await query(
      `
      SELECT *
      FROM subscriptions
      WHERE user_numeric_id = $1
        AND status = 'active'
      ORDER BY started_at DESC, created_at DESC
      LIMIT 1
      `,
      [user.id]
    );

    const subscription = subscriptionResult.rows[0];

    // ✅ Count active jobs posted by this recruiter
    let jobsPosted = 0;
    try {
      const jobsCountRes = await query(
        `SELECT COUNT(*) FROM jobs WHERE user_id = $1 AND (is_delete IS NULL OR is_delete = false)`,
        [user.id]
      );
      jobsPosted = parseInt(jobsCountRes.rows[0]?.count || "0", 10);
    } catch (countErr) {
      console.warn("Could not count recruiter jobs:", countErr);
    }

    if (!subscription) {
      return NextResponse.json(
        {
          has_active_subscription: false,
          package_name: "No Active Plan",
          job_post_count: 0,
          posts_used: jobsPosted,
          posts_remaining: 0,
          profile_view_count: 0,
          email_count: 0,
          status: "none",
          expiry_date: null,
        },
        {
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    // ✅ Get plan details
    const planResult = await query(
      `SELECT * FROM plans WHERE id = $1 LIMIT 1`,
      [subscription.plan_id]
    );

    const plan = planResult.rows[0] || {};
    const postLimit = Number(plan.job_post_limit) || 0;
    const postRemaining = Math.max(0, postLimit - jobsPosted);

    function getExpiry(sub, planRow) {
      if (sub.expires_at) {
        return new Date(sub.expires_at).toISOString().slice(0, 10);
      }

      const durationDays = Number(planRow.duration_days) || 0;
      const start = new Date(sub.started_at);
      const exp = new Date(start.getTime() + durationDays * 86400000);
      return exp.toISOString().slice(0, 10);
    }

    return NextResponse.json(
      {
        has_active_subscription: true,
        subscription_id: subscription.id,
        plan_id: subscription.plan_id,
        package_name: plan.name || "Custom Plan",
        price: plan.price_inr,
        mrp: plan.mrp_inr,
        duration: plan.duration_days,
        job_post_count: postLimit,
        posts_used: jobsPosted,
        posts_remaining: postRemaining,
        profile_view_count: Number(plan.contact_limit) || 0,
        email_count: Number(plan.email_limit) || 0,
        start_date: subscription.started_at,
        expiry_date: getExpiry(subscription, plan),
        status: subscription.status,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("Active Subscription Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
