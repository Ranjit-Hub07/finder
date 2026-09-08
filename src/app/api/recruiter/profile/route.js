import pool from "@/lib/db";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { parseFormData } from "@/lib/formParser";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sanitize = (str) => str?.toString().trim().replace(/<[^>]*>?/gm, "");

async function saveFile(file, folder = "logos") {
  if (!file || !file.originalname || !file.buffer) {
    throw new Error("Invalid file object: missing name or buffer");
  }

  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = [".jpg", ".jpeg", ".png"];
  if (!allowed.includes(ext)) throw new Error("Invalid file type");

  const filename = `${uuidv4()}${ext}`;
  const dirPath = path.join(process.cwd(), "public", "image", "recruiters", folder);
  const filePath = path.join(dirPath, filename);

  await fs.promises.mkdir(dirPath, { recursive: true });
  await writeFile(filePath, file.buffer);

  return `/image/recruiters/${folder}/${filename}`;
}

// ✅ ID-based decode
async function getRecruiterIdFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("recruiter_token")?.value;

  if (!token) throw new Error("Unauthorized - No token");

  let decoded;
  try {
    decoded = verifyJwt(token);
  } catch (e) {
    throw new Error("Unauthorized - Invalid token");
  }

  const recruiterId = decoded?.recruiter_id || decoded?.id;

  if (!recruiterId) throw new Error("Unauthorized - Token missing recruiter_id");

  return Number(recruiterId);
}

/* -------------------- GET PROFILE -------------------- */
export async function GET() {
  try {
    const recruiterId = await getRecruiterIdFromCookie();

    const result = await pool.query("SELECT * FROM recruiters WHERE id = $1", [
      recruiterId,
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Recruiter not found" }, { status: 404 });
    }

    const recruiter = result.rows[0];

    const mappedData = {
      full_name: recruiter.full_name || "",
      company_name: recruiter.company_name || "",
      designation: recruiter.current_designation || "",
      company_starting_year: recruiter.from_year || "",
      address: recruiter.address || "",
      city: recruiter.city || "",
      pin_code: recruiter.pincode || "",
      country: recruiter.country || "",
      state: recruiter.state || "",
      achievement_year: recruiter.to_year || "",
      about_company: recruiter.about_company || "",
      why_choose_us: recruiter.why_choose_us || "",
      email: recruiter.email || "", // ✅ still can return email for UI, but not used for query
      company_banner: recruiter.company_banner || "",
      company_logo: recruiter.company_logo || "",
    };

    return NextResponse.json(mappedData, { status: 200 });
  } catch (err) {
    const msg = err?.message || "Server error";

    if (String(msg).toLowerCase().includes("unauthorized")) {
      return NextResponse.json({ message: msg }, { status: 401 });
    }

    console.error("GET /api/recruiter/profile error:", err);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

/* -------------------- UPDATE PROFILE -------------------- */
export async function POST(req) {
  try {
    const recruiterId = await getRecruiterIdFromCookie();

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ message: "Unsupported content type" }, { status: 400 });
    }

    const boundary = contentType.split("boundary=")[1];
    if (!boundary) {
      return NextResponse.json({ message: "Missing form boundary" }, { status: 400 });
    }

    const body = await req.arrayBuffer();
    const { fields, files } = await parseFormData(Buffer.from(body), boundary);

    const required = ["company_name", "designation", "country", "city"];
    for (const field of required) {
      if (!fields[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const sanitized = {};
    for (const key in fields) sanitized[key] = sanitize(fields[key]);

    let bannerPath = null;
    let logoPath = null;

    try {
      if (files?.company_banner) bannerPath = await saveFile(files.company_banner, "banners");
      if (files?.company_logo) logoPath = await saveFile(files.company_logo, "logos");
    } catch (fileErr) {
      console.error("File save error:", fileErr);
      return NextResponse.json({ message: "Invalid file upload" }, { status: 400 });
    }

    const query = `
      UPDATE recruiters SET
        company_name = $1,
        current_designation = $2,
        from_year = $3,
        address = $4,
        city = $5,
        pincode = $6,
        country = $7,
        state = $8,
        to_year = $9,
        about_company = $10,
        why_choose_us = $11,
        company_banner = COALESCE($12, company_banner),
        company_logo = COALESCE($13, company_logo)
      WHERE id = $14
      RETURNING company_logo, company_banner
    `;

    const values = [
      sanitized.company_name,
      sanitized.designation,
      sanitized.company_starting_year || null,
      sanitized.address || null,
      sanitized.city || null,
      sanitized.pin_code || null,
      sanitized.country || null,
      sanitized.state || null,
      sanitized.achievement_year || null,
      sanitized.about_company || null,
      sanitized.why_choose_us || null,
      bannerPath,
      logoPath,
      recruiterId,
    ];

    const updated = await pool.query(query, values);

    const finalLogo = updated.rows[0]?.company_logo || null;
    const finalBanner = updated.rows[0]?.company_banner || null;

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        company_logo: finalLogo,      // ✅ TOP LEVEL
        company_banner: finalBanner,  // ✅ TOP LEVEL
        profile: {
          ...sanitized,
          company_logo: finalLogo,
          company_banner: finalBanner,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    const msg = err?.message || "Server error";

    if (String(msg).toLowerCase().includes("unauthorized")) {
      return NextResponse.json({ message: msg }, { status: 401 });
    }

    console.error("POST /api/recruiter/profile error:", err);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
