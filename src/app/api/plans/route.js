import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const group = searchParams.get("group") || "PSP";

    const result = await query(
      `SELECT * FROM plans WHERE active = true AND group_code = $1 ORDER BY price_inr ASC`,
      [group]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Plans API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
