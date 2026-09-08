import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return new Response(JSON.stringify({ message: "Token and password are required" }), { status: 400 });
    }

    // Fetch user by token and check if it's still valid
    const result = await pool.query(
      "SELECT id, reset_token_expiry FROM seekers WHERE reset_token = $1",
      [token]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: "Invalid or expired token" }), { status: 400 });
    }

    const user = result.rows[0];
    if (new Date() > new Date(user.reset_token_expiry)) {
      return new Response(JSON.stringify({ message: "Token has expired" }), { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token info
    await pool.query(
      "UPDATE seekers SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2",
      [hashedPassword, user.id]
    );

    return new Response(JSON.stringify({ message: "Password reset successful" }), { status: 200 });

  } catch (error) {
    console.error("Reset password error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
