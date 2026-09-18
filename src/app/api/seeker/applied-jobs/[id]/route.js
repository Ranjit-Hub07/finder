import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

async function getSeekerId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("seeker_token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const candidateId = decoded.seeker_id || decoded.id || decoded.userId;
    if (!candidateId) return null;

    const check = await pool.query(
      `SELECT id FROM seekers WHERE id = $1 LIMIT 1`,
      [candidateId]
    );
    if (!check.rows.length) return null;

    return candidateId;
  } catch (err) {
    console.error("JWT verification error in applied-jobs/[id]:", err);
    return null;
  }
}

// DELETE: Withdraw (soft delete) an application
export async function DELETE(req, { params }) {
  try {
    const seekerId = await getSeekerId();
    if (!seekerId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams?.id, 10);
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Soft delete — only allow withdrawing if the application belongs to this seeker
    // and is still in "Pending" status
    const result = await pool.query(
      `UPDATE job_apply
       SET is_delete = true, updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND COALESCE(status, 'Pending') = 'Pending'
       RETURNING id`,
      [id, seekerId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Application not found or cannot be withdrawn" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Application withdrawn successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /api/seeker/applied-jobs/[id] error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
