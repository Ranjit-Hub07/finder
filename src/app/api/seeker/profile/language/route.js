import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

// ============================
// ✅ GET LANGUAGES
// ============================
export async function GET() {
  try {
    const cookieStore = await cookies(); // ✅ FIXED
    const token = cookieStore.get("seeker_token")?.value;

    if (!token) return NextResponse.json([], { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seekerId = decoded.seeker_id;

    if (!seekerId) return NextResponse.json([], { status: 401 });

    const result = await pool.query(
      "SELECT languages FROM seekers WHERE id = $1",
      [seekerId]
    );

    const languagesString = result.rows[0]?.languages || "";

    const languages = languagesString
      ? languagesString.split(",").map((l) => l.trim())
      : [];

    return NextResponse.json(languages);
  } catch (error) {
    console.error("Error loading seeker languages:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// ============================
// ✅ UPDATE LANGUAGES
// ============================
export async function POST(req) {
  try {
    const cookieStore = await cookies(); // ✅ FIXED
    const token = cookieStore.get("seeker_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seekerId = decoded.seeker_id;

    if (!seekerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { languages } = await req.json();
    const languageString = languages.join(", ");

    await pool.query(
      "UPDATE seekers SET languages = $1 WHERE id = $2",
      [languageString, seekerId]
    );

    return NextResponse.json({ success: true, updated: languages });
  } catch (error) {
    console.error("Error updating languages:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
