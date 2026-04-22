import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "هذا المسار معطل لأسباب أمنية" },
    { status: 410 },
  );
}
