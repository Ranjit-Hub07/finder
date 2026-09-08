import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getAuthUser() {
  try {
    const cookieStore = await cookies(); // MUST be awaited
    const token = cookieStore.get("recruiter_token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded; // contains user.id, email, role
  } catch (err) {
    console.error("Auth helper error:", err);
    return null;
  }
}

// Optional: API endpoint to check login status
export async function GET() {
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json({ loggedIn: false });
  }

  return NextResponse.json({
    loggedIn: true,
    user,
  });
}
