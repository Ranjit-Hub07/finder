import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ Get a single job role by ID
export async function GET(req, { params }) {
  const { id } = params;
  try {
    const result = await pool.query(
      `SELECT jr.role_id, jr.role_name, jr.role_desc, jr.is_active,
              ji.indus_id, ji.indus_name
       FROM du_job_role jr
       LEFT JOIN du_job_industry ji ON jr.indus_id = ji.indus_id
       WHERE jr.role_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Job role not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching job role:", error);
    return NextResponse.json({ error: "Failed to fetch job role" }, { status: 500 });
  }
}

// ✅ Update job role
export async function PUT(req, { params }) {
  const { id } = params;
  try {
    const { role_name, role_desc, indus_id, is_active } = await req.json();

    const result = await pool.query(
      `UPDATE du_job_role
       SET role_name = $1, role_desc = $2, indus_id = $3, is_active = $4, updated_at = NOW()
       WHERE role_id = $5
       RETURNING *`,
      [role_name, role_desc, indus_id, is_active ?? true, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Job role not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating job role:", error);
    return NextResponse.json({ error: "Failed to update job role" }, { status: 500 });
  }
}

// ✅ Delete job role
export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    const result = await pool.query(
      "DELETE FROM du_job_role WHERE role_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Job role not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Job role deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting job role:", error);
    return NextResponse.json({ error: "Failed to delete job role" }, { status: 500 });
  }
}
