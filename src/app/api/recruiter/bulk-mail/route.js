import pool from "@/lib/db";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    // 🔥 Fetch Phone-Screened Candidates
    const applicants = await pool.query(
      `SELECT s.email
       FROM job_apply ja
       JOIN seekers s ON ja.user_id = s.id
       WHERE ja.job_id = $1 
       AND ja.status = 'Phone Screened'
       AND ja.is_active = true`,
      [jobId]
    );

    if (applicants.rows.length === 0) {
      return NextResponse.json({
        message: "No phone-screened candidates found for this job",
      });
    }

    // 📧 Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS,  
      },
    });

    // 📤 Send emails (🔥 UPDATED MESSAGE)
    for (const user of applicants.rows) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Interview Selection Update",
        text: 
`Congratulations!

You have been selected for the next round of interview for the job you applied for.

Our team will contact you shortly with further instructions and schedule details.

Thank you for your patience.
Stay tuned!`,
      });
    }

    return NextResponse.json({
      message: "Updated interview emails sent to all phone-screened candidates",
    });
  } catch (error) {
    console.error("Bulk Email Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
