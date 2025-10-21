import { queryRecommendations } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  try {
    const recommendations = await queryRecommendations();

    return NextResponse.json({ success: true, recommendations }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
