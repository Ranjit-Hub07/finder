import pool from "@/lib/db"; // your pg connection

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();

  try {
    let query = "SELECT id, name FROM skills";
    let values = [];

    if (search) {
      query += " WHERE LOWER(name) LIKE $1";
      values.push(`%${search}%`);
    }

    const { rows } = await pool.query(query, values);

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
