import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { sendJobApplicationAutoReply, sendRecruiterApplicationAlert } from "@/lib/email";

export async function POST(req) {
  try {
    const cookieStore = cookies(); // ✅ FIXED (no await)
    const token = cookieStore.get("seeker_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - Token missing" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seekerId = decoded.seeker_id; // ✅ FIXED

    if (!seekerId) {
      return NextResponse.json(
        { message: "Unauthorized - Invalid token payload" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const job_id = body?.job_id;

    if (!job_id) {
      return NextResponse.json(
        { message: "job_id is required" },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO job_apply 
        (user_id, job_id, job_apply_date, status, is_active, is_delete, created_at, updated_at) 
        VALUES ($1, $2, NOW(), 'Pending', true, false, NOW(), NOW())`,
      [seekerId, job_id]
    );

    // 📧 Auto-respond to candidate & notify recruiter (non-blocking)
    try {
      const [seekerRes, jobRes] = await Promise.all([
        pool.query(`SELECT name, email, phone FROM seekers WHERE id = $1`, [seekerId]),
        pool.query(
          `SELECT j.job_title, j.job_company, r.email AS recruiter_email, r.full_name AS recruiter_name
           FROM jobs j
           LEFT JOIN recruiters r ON j.user_id = r.id
           WHERE j.id = $1`,
          [job_id]
        ),
      ]);

      const seeker = seekerRes.rows[0];
      const job = jobRes.rows[0];

      if (seeker?.email) {
        await sendJobApplicationAutoReply({
          to: seeker.email,
          applicantName: seeker.name,
          jobTitle: job?.job_title || "Job Opening",
          companyName: job?.job_company || "",
        });
      }

      const recruiterRecipient = job?.recruiter_email || process.env.EMAIL_USER;
      if (recruiterRecipient) {
        await sendRecruiterApplicationAlert({
          to: recruiterRecipient,
          applicantName: seeker?.name || "Candidate",
          applicantEmail: seeker?.email || "N/A",
          applicantPhone: seeker?.phone || "",
          jobTitle: job?.job_title || "Job Application",
        });
      }
    } catch (emailErr) {
      console.error("Application email dispatch error:", emailErr);
    }

    return NextResponse.json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Apply Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
