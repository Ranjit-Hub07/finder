import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ GET comments for a specific blog
export async function GET(req, { params }) {
  try {
    const blog_id = params.id;

    if (!blog_id) {
      return NextResponse.json(
        { error: "Blog ID missing in URL" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT id, name, email, comment, created_at 
       FROM comments 
       WHERE blog_id = $1 
       ORDER BY created_at DESC`,
      [blog_id]
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Error fetching comments" },
      { status: 500 }
    );
  }
}

// ✅ POST a new comment for a specific blog (with reCAPTCHA verification)
export async function POST(req, { params }) {
  try {
    const blog_id = params.id;
    const { name, email, comment, recaptchaToken } = await req.json();

    // 🔒 Basic validation
    if (!blog_id || !name || !email || !comment || !recaptchaToken) {
      return NextResponse.json(
        { error: "Missing fields or CAPTCHA token" },
        { status: 400 }
      );
    }

    // ✅ Verify Google reCAPTCHA
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    const captchaRes = await fetch(verifyUrl, { method: "POST" });
    const captchaData = await captchaRes.json();

    if (!captchaData.success) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 400 }
      );
    }

    // 🕒 Insert comment with timestamp
    await pool.query(
      `INSERT INTO comments (blog_id, name, email, comment, created_at) 
       VALUES ($1, $2, $3, $4, NOW())`,
      [blog_id, name, email, comment]
    );

    return NextResponse.json(
      { message: "Comment added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Error adding comment" },
      { status: 500 }
    );
  }
}
