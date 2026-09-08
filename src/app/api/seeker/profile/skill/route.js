import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// ===================================
// ✅ GET: Fetch selected skills
// ===================================
export async function GET() {
  try {
    const cookieStore = await cookies(); // no await
    const token = cookieStore.get("seeker_token")?.value;

    if (!token) {
      return NextResponse.json({ skills: [] }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seekerId = decoded.seeker_id;

    if (!seekerId) {
      return NextResponse.json({ skills: [] }, { status: 401 });
    }

    // Fetch seeker skill IDs
    const result = await pool.query(
      `SELECT job_skill_ids FROM seekers WHERE id = $1`,
      [seekerId]
    );

    const skillIds = result.rows[0]?.job_skill_ids || [];

    if (!skillIds.length) {
      return NextResponse.json({ skills: [] });
    }

    // Fetch matching skills from master table
    const skillsResult = await pool.query(
      `SELECT id, name FROM skills WHERE id = ANY($1::int[])`,
      [skillIds]
    );

    return NextResponse.json({ skills: skillsResult.rows });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ===================================
// ✅ PUT: Update seeker skills
// ===================================
export async function PUT(request) {
  const client = await pool.connect();

  try {
    const cookieStore = await cookies(); // no await
    const token = cookieStore.get("seeker_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seekerId = decoded.seeker_id;

    if (!seekerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const skills = body.skills; // expecting [1,2,3]

    if (!Array.isArray(skills)) {
      return NextResponse.json(
        { error: "Invalid skills data" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    const seekerCheck = await client.query(
      `SELECT id FROM seekers WHERE id = $1`,
      [seekerId]
    );

    if (seekerCheck.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Seeker not found" }, { status: 404 });
    }

    await client.query(
      `UPDATE seekers SET job_skill_ids = $1::int[] WHERE id = $2`,
      [skills, seekerId]
    );

    await client.query("COMMIT");

    return NextResponse.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
