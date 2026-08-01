import { NextRequest, NextResponse } from "next/server";
import { processSadyaQuery } from "@/ai/assistant/chatEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.query || typeof body.query !== "string") {
      return NextResponse.json({ success: false, error: "Query string is required" }, { status: 400 });
    }

    const response = await processSadyaQuery(body.query, body.history || []);
    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process AI query" },
      { status: 500 }
    );
  }
}
