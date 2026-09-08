// app/api/language/route.js

const languages = [
  "Adi", "Angami", "Ao", "Assamese", "Bengali", "Bhili/Bhilodi", "Bodo", "Coorgi/Kodagu",
  "Dimasa", "Dogri", "English", "Garo", "Gondi", "Gujarati", "Halabi", "Hindi", "Ho",
  "Kannada", "Karbi/Mikir", "Kashmiri", "Khandeshi", "Kharia", "Khasi", "Khond/Kondh",
  "Kisan", "Kolami", "Konkani", "Konyak", "Korku", "Kui", "Kurukh", "Ladakhi", "Lotha",
  "Lushai/Mizo", "Maithili", "Malayalam", "Malto", "Marathi", "Meitei/Manipuri", "Miri/Mishing",
  "Munda", "Mundari", "Nepali", "Nissi/Dafla", "Odia", "Phom", "Punjabi", "Rabha", "Santali",
  "Savara", "Sema", "Sindhi", "Tamil", "Tangkhul", "Telugu", "Thado", "Tripuri", "Tulu",
  "Tribal Language Teacher (Santali)"
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();

  const filtered = search
    ? languages.filter((lang) => lang.toLowerCase().includes(search))
    : languages;

  return new Response(JSON.stringify(filtered), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
