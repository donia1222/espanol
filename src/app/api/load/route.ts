import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const BASE_URL = API_URL.replace(/php\/$/, "");

function fixImagePaths(data: Record<string, Record<string, string>>) {
  for (const key in data) {
    const fields = data[key];
    if (fields.src && !fields.src.startsWith("http") && !fields.src.startsWith("data:")) {
      fields.src = BASE_URL + fields.src;
    }
    if (fields.logoSrc && !fields.logoSrc.startsWith("http") && !fields.logoSrc.startsWith("data:")) {
      fields.logoSrc = BASE_URL + fields.logoSrc;
    }
  }
  return data;
}

export async function GET() {
  const res = await fetch(API_URL + "load.php", {
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return NextResponse.json(fixImagePaths(data));
}
