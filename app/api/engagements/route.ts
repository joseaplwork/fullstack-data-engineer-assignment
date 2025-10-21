import { queryEngagementsWithDetails } from "@/lib/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const engagements = await queryEngagementsWithDetails();

    return NextResponse.json({ success: true, engagements }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch engagements" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
