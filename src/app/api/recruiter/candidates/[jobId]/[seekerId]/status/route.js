import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ PUT: Update candidate status (SECURE)
export async function PUT(req, { params }) {
  try {
    const { jobId, seekerId } = params;

    // ✅ Validate params
    if (!jobId || !seekerId) {
      return NextResponse.json(
        { error: "Invalid jobId or seekerId" },
        { status: 400 }
      );
    }

    // ✅ AUTH: Recruiter only
    const cookieStore = cookies();
    const token = cookieStore.get("recruiter_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded?.recruiter_id) {
      return NextResponse.json({ error: "Invalid recruiter token" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // ✅ Allowed statuses
    const allowedStatuses = [
      "Pending",
      "Reviewed",
      "Phone Screened",
      "Interviewed",
      "Offer Made",
      "Hired",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE job_apply 
       SET status = $1, updated_at = NOW()
       WHERE user_id = $2 AND job_id = $3
       RETURNING status`,
      [status, seekerId, jobId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "No matching candidate for this job" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, status: result.rows[0].status },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error updating candidate status:", err);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
