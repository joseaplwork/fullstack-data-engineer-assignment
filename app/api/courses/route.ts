import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await connectToDatabase();

  return NextResponse.json(
    {
      success: true,
      courses: await db.collection("courses").find().toArray(),
    },
    { status: 200 }
  );
}
export const dynamic = "force-dynamic";
