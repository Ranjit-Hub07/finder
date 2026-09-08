import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return new Response(JSON.stringify({ message: "Token and password are required" }), { status: 400 });
    }

    const result = await pool.query(
      "SELECT id, token_expires FROM recruiters WHERE reset_token = $1",
      [token]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: "Invalid or expired token" }), { status: 400 });
    }

    const user = result.rows[0];
    if (new Date() > user.token_expires) {
      return new Response(JSON.stringify({ message: "Token has expired" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE recruiters SET password = $1, reset_token = NULL, token_expires = NULL WHERE id = $2",
      [hashedPassword, user.id]
    );

    return new Response(JSON.stringify({ message: "Password reset successful" }), { status: 200 });

  } catch (error) {
    console.error("Reset password error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
