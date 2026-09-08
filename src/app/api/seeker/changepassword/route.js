import pool from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req) {
  try {
    // ✅ Get JWT token from cookie
    const cookieStore =await cookies(); // cookies() is sync
    const token = cookieStore.get("seeker_token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized - No token" }), {
        status: 401,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ message: "Invalid or expired token" }), {
        status: 403,
      });
    }

    const { email, id: seekerId } = decoded;
    if (!email || !seekerId) {
      return new Response(JSON.stringify({ message: "Token payload incomplete" }), {
        status: 401,
      });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ message: "Missing fields" }), {
        status: 400,
      });
    }

    const result = await pool.query("SELECT password FROM seekers WHERE email = $1", [email]);

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const user = result.rows[0];
    const isValid = await verifyPassword(currentPassword, user.password);

    if (!isValid) {
      return new Response(JSON.stringify({ message: "Incorrect current password" }), {
        status: 401,
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    await pool.query("UPDATE seekers SET password = $1 WHERE email = $2", [
      hashedPassword,
      email,
    ]);

    // ✅ Reissue JWT
    const newToken = jwt.sign({ seekerId, email }, JWT_SECRET, { expiresIn: "1h" });

    const response = new Response(
      JSON.stringify({ message: "Password updated successfully" }),
      { status: 200 }
    );

    response.headers.set(
      "Set-Cookie",
      `seeker_token=${newToken}; HttpOnly; Path=/; Max-Age=3600`
    );

    return response;
  } catch (error) {
    console.error("Change password error:", error.message);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
