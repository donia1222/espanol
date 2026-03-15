import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const BASE_URL = API_URL.replace(/php\/$/, "");

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("image") as File | null;
  const field = formData.get("field") as string || "image";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Try remote PHP upload first
  try {
    const remoteForm = new FormData();
    remoteForm.append("image", file);
    remoteForm.append("field", field);
    const res = await fetch(API_URL + "upload.php", {
      method: "POST",
      body: remoteForm,
    });
    if (res.ok) {
      const data = await res.json();
      if (data.path) {
        if (!data.path.startsWith("http")) {
          data.path = BASE_URL + data.path;
        }
        return NextResponse.json(data);
      }
    }
  } catch {
    // Remote upload failed, fall through to local
  }

  // Fallback: save locally to /public/uploads/
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.type === "image/png" ? ".png" : ".jpg";
    const filename = Date.now() + "-" + Math.random().toString(36).substring(2, 8) + ext;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await writeFile(path.join(uploadDir, filename), buffer);
    return NextResponse.json({ path: "/uploads/" + filename });
  } catch (err) {
    console.error("[Upload] Local save failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
