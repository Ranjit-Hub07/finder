import pool from "@/lib/db";

export async function GET() {
  try {
    const query = "SELECT educ_id, educ_name FROM du_job_education ORDER BY educ_name ASC";
    const result = await pool.query(query);

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Fetch Education Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
