import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET;

// 🔧 Helper to parse JSON safely
function safeParseJSON(data, fallback = []) {
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

// ✅ Extract seeker ID from JWT token in App Router
function getSeekerIdFromJWT() {
  const cookieStore = cookies();
  const token = cookieStore.get("seeker_token")?.value;

  if (!token) throw new Error("No auth token found");

  try {
    const decoded = jwt.verify(token, SECRET);
    const seekerId = decoded?.seeker_id; // ✅ FIXED

    if (!seekerId) throw new Error("Invalid token payload");
    return seekerId;
  } catch (err) {
    console.error("JWT verification failed:", err);
    throw new Error("Invalid token");
  }
}

// ===================================
// ✅ GET: Fetch seeker projects
// ===================================
export async function GET() {
  try {
    const seekerId = getSeekerIdFromJWT();

    const result = await pool.query(
      "SELECT project_name FROM seekers WHERE id = $1",
      [seekerId]
    );

    const projectData = safeParseJSON(result.rows[0]?.project_name || "[]");

    return Response.json(projectData, { status: 200 });
  } catch (err) {
    console.error("GET /project error:", err.message);
    return Response.json({ error: err.message }, { status: 401 });
    }
}

// ===================================
// ✅ POST: Add a new project
// ===================================
export async function POST(req) {
  try {
    const seekerId = getSeekerIdFromJWT();
    const { newProject } = await req.json();

    const result = await pool.query(
      "SELECT project_name FROM seekers WHERE id = $1",
      [seekerId]
    );

    const current = safeParseJSON(result.rows[0]?.project_name || "[]");
    current.push(newProject);

    await pool.query(
      "UPDATE seekers SET project_name = $1 WHERE id = $2",
      [JSON.stringify(current), seekerId]
    );

    return Response.json(current, { status: 200 });
  } catch (err) {
    console.error("POST /project error:", err.message);
    return Response.json({ error: err.message }, { status: 401 });
  }
}

// ===================================
// ✅ DELETE: Remove project by index
// ===================================
export async function DELETE(req) {
  try {
    const seekerId = getSeekerIdFromJWT();
    const { index } = await req.json();

    const result = await pool.query(
      "SELECT project_name FROM seekers WHERE id = $1",
      [seekerId]
    );

    const current = safeParseJSON(result.rows[0]?.project_name || "[]");

    if (index < 0 || index >= current.length) {
      return Response.json({ error: "Invalid index" }, { status: 400 });
    }

    current.splice(index, 1);

    await pool.query(
      "UPDATE seekers SET project_name = $1 WHERE id = $2",
      [JSON.stringify(current), seekerId]
    );

    return Response.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /project error:", err.message);
    return Response.json({ error: err.message }, { status: 401 });
  }
}
