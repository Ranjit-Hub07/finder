import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM jobs WHERE is_active = true AND is_delete = false ORDER BY created_at DESC"
    );

    return new Response(JSON.stringify({ jobs: rows }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch jobs" }), {
      status: 500,
    });
  }
}
