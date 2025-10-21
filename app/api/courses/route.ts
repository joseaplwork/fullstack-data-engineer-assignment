import { queryCourses } from "@/lib/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const courses = await queryCourses();

    return NextResponse.json({ success: true, courses }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
