import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, { params }) {
  const { id } = params;
  try {
    const result = await pool.query("SELECT * FROM blogs WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error fetching blog" }, { status: 500 });
  }
}