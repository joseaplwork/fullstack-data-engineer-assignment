import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectToDatabase();

    return NextResponse.json(
      {
        success: true,
        users: await db.collection("users").find().toArray(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get users",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
