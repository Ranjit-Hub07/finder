import { IncomingForm } from "formidable";
import path from "path";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { PassThrough } from "stream";
import fs from "fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// If you're using App Router, this is not required but okay:
export const config = { api: { bodyParser: false } };

async function toNodeReadable(req) {
  const reader = req.body.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const buffer = Buffer.concat(chunks);
  const stream = new PassThrough();
  stream.end(buffer);

  return {
    headers: {
      "content-type": req.headers.get("content-type") || "",
      "content-length": buffer.length.toString(),
    },
    pipe: stream.pipe.bind(stream),
    on: (...args) => stream.on(...args),
    pause: () => {},
    resume: () => {},
  };
}

export async function POST(req) {
  try {
    const nodeReq = await toNodeReadable(req);

    const photoDir = path.join(process.cwd(), "public", "image", "seekers", "Photos");
    const resumeDir = path.join(process.cwd(), "public", "image", "seekers", "Resume");

    if (!fs.existsSync(photoDir)) fs.mkdirSync(photoDir, { recursive: true });
    if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir, { recursive: true });

    const form = new IncomingForm({
      uploadDir: photoDir,
      keepExtensions: true,
      multiples: false,
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) =>
        err ? reject(err) : resolve({ fields, files })
      );
    });

    const data = Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
    );

    let {
      name,
      email,
      phone,
      password,
      address,
      job_type,
      qualification,
      otp,
      job_role,
      location,
      working,
      experience,
      passport,
      languages,
      dob,
      gender,
      industry,
    } = data;

    const safeEmail = email ? String(email).trim().toLowerCase() : "";
    const safePhone = phone ? String(phone).trim() : "";
    const otpStr = otp ? String(otp).trim() : "";

    // ✅ Required fields
    if (!name || !safeEmail || !safePhone || !password || !address || !job_type || !qualification || !otpStr) {
      return new Response(
        JSON.stringify({ message: "Required fields missing" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (String(password).length < 8) {
      return new Response(
        JSON.stringify({ message: "Password must be at least 8 characters long" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅✅ OTP FLOW (Same as Recruiter)
    // 1) Get latest OTP
    const otpRes = await pool.query(
      `
      SELECT id, otp, expires_at, is_used
      FROM otps
      WHERE email=$1 AND user_type='seeker' AND purpose='register'
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [safeEmail]
    );

    if (otpRes.rowCount === 0) {
      return new Response(
        JSON.stringify({ message: "OTP not found. Please request OTP first." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const otpRow = otpRes.rows[0];

    // 2) Must match entered OTP
    if (String(otpRow.otp) !== otpStr) {
      return new Response(
        JSON.stringify({ message: "Invalid OTP" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3) Must be verified already (is_used = true)
    if (!otpRow.is_used) {
      return new Response(
        JSON.stringify({ message: "Please verify OTP first" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4) Expiry check
    if (new Date() > new Date(otpRow.expires_at)) {
      return new Response(
        JSON.stringify({ message: "OTP expired" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Prevent duplicate seeker registration by email
    const existing = await pool.query(`SELECT id FROM seekers WHERE LOWER(email) = $1`, [safeEmail]);
    if (existing.rowCount > 0) {
      return new Response(
        JSON.stringify({ message: "Email already registered" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Duplicate phone
    const phoneCheck = await pool.query(`SELECT id FROM seekers WHERE phone = $1`, [safePhone]);
    if (phoneCheck.rowCount > 0) {
      return new Response(
        JSON.stringify({ message: "Phone number already in use" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const formattedLanguages = typeof languages === "string" ? languages : null;

    // ✅ File handling
    const photoPath =
      files.photo?.filepath ||
      (Array.isArray(files.photo) ? files.photo[0]?.filepath : null);

    const resumeTempPath =
      files.resume?.filepath ||
      (Array.isArray(files.resume) ? files.resume[0]?.filepath : null);

    let resumeFinalPath = "";
    if (resumeTempPath) {
      const resumeFilename = path.basename(resumeTempPath);
      resumeFinalPath = path.join(resumeDir, resumeFilename);
      fs.renameSync(resumeTempPath, resumeFinalPath);
    }

    const photoFile = photoPath ? `/image/seekers/Photos/${path.basename(photoPath)}` : "";
    const resumeFile = resumeFinalPath ? `/image/seekers/Resume/${path.basename(resumeFinalPath)}` : "";

    // ✅ Insert seeker record (since you said you want recruiter-like)
    await pool.query(
      `
      INSERT INTO seekers (
        name, email, phone, password, address,
        job_type, qualification, job_role, location,
        photo, resume, working, experience, passport,
        languages, dob, gender, industry
      ) VALUES (
        $1,$2,$3,$4,$5,
        $6,$7,$8,$9,
        $10,$11,$12,$13,$14,
        $15,$16,$17,$18
      )
      `,
      [
        name,
        safeEmail,
        safePhone,
        hashedPassword,
        address,
        job_type,
        qualification,
        job_role || null,
        location || null,
        photoFile,
        resumeFile,
        working || null,
        experience || null,
        passport || null,
        formattedLanguages,
        dob || null,
        gender || null,
        industry || null,
      ]
    );

    // ✅ Delete OTP after successful registration (same as recruiter)
    await pool.query(
      `DELETE FROM otps WHERE email=$1 AND user_type='seeker' AND purpose='register'`,
      [safeEmail]
    );

    return new Response(
      JSON.stringify({ message: "Seeker registered successfully" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Seeker Registration error:", error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
