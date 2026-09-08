import { NextResponse } from "next/server";
import pool from "@/lib/db";

const DEFAULT_INDIAN_CITIES = [
  "Bhubaneswar",
  "Bengaluru",
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Noida",
  "Gurugram",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh",
  "Indore",
  "Kochi",
  "Coimbatore",
  "Nagpur",
  "Lucknow",
  "Surat",
  "Patna",
  "Visakhapatnam",
  "Bhopal",
  "Vadodara",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Varanasi",
  "Ranchi",
  "Guwahati",
  "Thiruvananthapuram",
  "Dehradun",
  "Cuttack",
  "Puri",
  "Rourkela",
  "Sambalpur",
  "Berhampur",
  "Mysuru",
  "Mangaluru",
  "Raipur",
  "Jamshedpur",
  "Amritsar",
  "Faridabad",
  "Ghaziabad",
  "Rajkot",
  "Gwalior",
  "Vijayawada",
  "Jodhpur",
  "Madurai",
  "Kanpur",
  "Allahabad",
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get("countryCode") || "IN";

  try {
    // 1. Try external CSC API if key exists
    if (process.env.NEXT_PUBLIC_CSC_API_KEY) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const response = await fetch(
          `https://api.countrystatecity.in/v1/countries/${countryCode}/cities`,
          {
            headers: {
              "X-CSCAPI-KEY": process.env.NEXT_PUBLIC_CSC_API_KEY,
            },
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            return NextResponse.json(data);
          }
        }
      } catch (fetchErr) {
        // Fallback to internal list on network error or timeout
      }
    }

    // 2. Fetch any distinct cities already present in the jobs DB
    let dbCities = [];
    try {
      const dbRes = await pool.query(
        "SELECT DISTINCT job_cityid FROM jobs WHERE job_cityid IS NOT NULL AND job_cityid != ''"
      );
      dbCities = dbRes.rows.map((r) => r.job_cityid);
    } catch (dbErr) {
      // Ignore DB error, use static list
    }

    // 3. Merge DB cities with curated city list
    const combinedCityNames = Array.from(
      new Set([...dbCities, ...DEFAULT_INDIAN_CITIES])
    );

    const formattedCities = combinedCityNames.map((name, index) => ({
      id: index + 1,
      name: name,
    }));

    return NextResponse.json(formattedCities);
  } catch (error) {
    console.error("City fetch fallback error:", error);
    // Even in worst case, return the static list
    const fallback = DEFAULT_INDIAN_CITIES.map((name, index) => ({
      id: index + 1,
      name: name,
    }));
    return NextResponse.json(fallback);
  }
}
