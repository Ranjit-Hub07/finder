import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" }, { status: 200 });

  // clear recruiter token
  res.cookies.set("recruiter_token", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax", // match your login cookie (you used lax)
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });

  // clear seeker token
  res.cookies.set("seeker_token", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax", // match your login cookie (you used lax)
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });

  return res;
}
