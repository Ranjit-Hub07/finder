import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { sendJobApplicationAutoReply } from "@/lib/email";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const position = formData.get("position");
    const cv = formData.get("cv");

    if (!cv) {
      return NextResponse.json({ message: "CV required" }, { status: 400 });
    }

    // 📁 Save CV
    const bytes = await cv.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, `${Date.now()}-${cv.name}`);
    fs.writeFileSync(filePath, buffer);

    // 📧 Mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Career Portal" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // ✅ using existing env email
      subject: `New Job Application - ${position}`,
      html: `
        <h3>New Job Application</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Position:</strong> ${position}</p>
      `,
      attachments: [
        {
          filename: cv.name,
          path: filePath,
        },
      ],
    });

    // 📩 Auto-respond to the applicant
    if (email) {
      try {
        await sendJobApplicationAutoReply({
          to: email,
          applicantName: name,
          jobTitle: position,
          companyName: "Job Portal",
        });
      } catch (autoReplyErr) {
        console.error("Auto-reply to career applicant failed:", autoReplyErr);
      }
    }

    return NextResponse.json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Career Apply Error:", error);
    return NextResponse.json(
      { message: "Failed to submit application" },
      { status: 500 }
    );
  }
}
