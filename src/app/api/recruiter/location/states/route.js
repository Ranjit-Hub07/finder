// /api/location/states/route.js

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get("countryCode");

  if (!countryCode) {
    return new Response(JSON.stringify({ error: "Missing countryCode" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, {
    headers: {
      "X-CSCAPI-KEY": process.env.NEXT_PUBLIC_CSC_API_KEY,
    },
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
