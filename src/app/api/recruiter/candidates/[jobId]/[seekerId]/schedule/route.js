import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

// Convert 24h time to 12h AM/PM format
function formatTimeToAMPM(time24) {
  const [hour, minute] = time24.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

export async function POST(req, context) {
  try {
    // ✅ Await params in App Router
    const { jobId, seekerId } = await context.params;

    if (!jobId || !seekerId) {
      return NextResponse.json({ error: "Invalid jobId or seekerId" }, { status: 400 });
    }

    // ✅ AUTH via JWT in cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("recruiter_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const recruiterName = decoded.full_name || "Recruiter";
    const recruiterEmail = decoded.email || null;

    // ✅ Parse request body
    const body = await req.json();
    const { interviewDate, interviewTime, interviewLocation, message } = body;

    if (!interviewDate || !interviewTime) {
      return NextResponse.json(
        { error: "Interview date and time are required" },
        { status: 400 }
      );
    }

    // ✅ Fetch candidate info from DB
    const { rows } = await pool.query(
      `SELECT s.name, s.email
       FROM seekers s
       JOIN job_apply ja ON ja.user_id = s.id
       WHERE s.id = $1 AND ja.job_id = $2
       LIMIT 1`,
      [seekerId, jobId]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    const candidate = rows[0];

    // ✅ Send email via nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // use true if port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${recruiterName}" <${process.env.EMAIL_USER}>`,
      to: candidate.email,
      replyTo: recruiterEmail,
      subject: "Interview Scheduled",
      html: `
        <h3>Hello ${candidate.name},</h3>
        <p>Your interview has been scheduled by <b>${recruiterName}</b>.</p>
        <p><b>Date:</b> ${interviewDate}</p>
        <p><b>Time:</b> ${formatTimeToAMPM(interviewTime)}</p>
        <p><b>Location:</b> ${interviewLocation || "To be informed"}</p>
        <p>${message || ""}</p>
      `,
    });

    return NextResponse.json({ message: "Interview email sent successfully!" });
  } catch (err) {
    console.error("❌ Interview email error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to send interview email" },
      { status: 500 }
    );
  }
}
