import { NextResponse } from "next/server";
import pool from "@/lib/db"; // adjust if needed

// ✅ POST — Save a new comment
export async function POST(req) {
  try {
    const { blog_id, name, email, comment } = await req.json();

    if (!blog_id || !name || !email || !comment) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Insert comment with timestamp
    await pool.query(
      `INSERT INTO comments (blog_id, name, email, comment, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [blog_id, name, email, comment]
    );

    return NextResponse.json({ message: "Comment saved successfully" });
  } catch (error) {
    console.error("Error saving comment:", error);
    return NextResponse.json(
      { message: "Error saving comment" },
      { status: 500 }
    );
  }
}

// ✅ GET — Fetch comments for a specific blog
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blog_id");

    if (!blogId) {
      return NextResponse.json(
        { message: "Blog ID is required" },
        { status: 400 }
      );
    }

    const { rows } = await pool.query(
      `SELECT id, name, comment, created_at 
       FROM comments
       WHERE blog_id = $1
       ORDER BY created_at DESC`,
      [blogId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Error fetching comments" },
      { status: 500 }
    );
  }
}
