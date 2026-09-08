import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const SECRET = process.env.JWT_SECRET;

async function getSeekerIdFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("seeker_token")?.value;

  if (!token) throw new Error("Token missing");

  const decoded = jwt.verify(token, SECRET);
  return decoded?.seeker_id;
}

export async function POST(req) {
  try {
    const seekerId = await getSeekerIdFromToken();

    if (!seekerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const photoFile = formData.get("photo");

    if (!photoFile || typeof photoFile === "string" || photoFile.size === 0) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Validate mime type
    const validMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "image/gif",
    ];
    if (!validMimeTypes.includes(photoFile.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPEG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (photoFile.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const imageDir = path.join(process.cwd(), "public", "image", "seekers", "Photos");
    await mkdir(imageDir, { recursive: true });

    const originalExt = path.extname(photoFile.name || "").toLowerCase() || ".png";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(originalExt)
      ? originalExt
      : ".png";
    const filename = `seeker_${seekerId}_${Date.now()}${safeExt}`;
    const imagePath = path.join(imageDir, filename);

    const buffer = Buffer.from(await photoFile.arrayBuffer());
    await writeFile(imagePath, buffer);

    const photoUrl = `/image/seekers/Photos/${filename}`;

    const { rows } = await pool.query(
      `UPDATE seekers SET photo = $1 WHERE id = $2 RETURNING photo`,
      [photoUrl, seekerId]
    );

    return NextResponse.json({
      message: "Profile photo updated successfully",
      photo: rows[0]?.photo || photoUrl,
    });
  } catch (err) {
    console.error("Photo upload error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update profile photo" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  return POST(req);
}
