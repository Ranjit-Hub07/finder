export async function GET(request) {
  const response = await fetch("https://api.countrystatecity.in/v1/countries", {
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
