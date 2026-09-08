import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// ✅ RECRUITER ONLY AUTH (FOR PACKAGE SYSTEM)
export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("recruiter_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      id: decoded.recruiter_id, // ✅ THIS is used as user_numeric_id
      email: decoded.email,
      role: "recruiter",
    };
  } catch {
    return null;
  }
}
