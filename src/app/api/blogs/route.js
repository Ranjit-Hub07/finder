import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ GET all blogs
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, title, image, excerpt, author, date 
       FROM blogs ORDER BY id DESC`
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// ✅ POST (admin adds a new blog)
export async function POST(req) {
  try {
    const { title, image, excerpt, author, content } = await req.json();

    if (!title || !image || !author || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const date = new Date().toISOString().split("T")[0];
    const result = await pool.query(
      `INSERT INTO blogs (title, image, excerpt, author, date, content)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, image, excerpt, author, date, content]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
