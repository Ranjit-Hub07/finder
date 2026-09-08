import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export async function PUT(request, { params }) {
  try {
    // ✅ await params (async dynamic API)
    const { id } = await params;
    const { status } = await request.json();

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

    // ✅ Update only if the job belongs to this recruiter
    const result = await pool.query(
      "UPDATE jobs SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [status.toLowerCase(), id, recruiterId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Job not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Job status updated",
      job: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating job status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
