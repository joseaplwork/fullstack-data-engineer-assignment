import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { generateSeedData } from "@/lib/seed-data";

export async function GET() {
  try {
    const db = await connectToDatabase();
    await generateSeedData(db);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed seed database",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
