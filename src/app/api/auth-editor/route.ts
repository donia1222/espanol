import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { code } = await request.json();
  const validCode = process.env.EDITOR_CODE || "sevelen9475";

  if (code === validCode) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: "Falscher Code" }, { status: 401 });
}
