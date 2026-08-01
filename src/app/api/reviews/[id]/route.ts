import { NextResponse } from "next/server";
import { ReviewService } from "@/services/review.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const replyText = body.reply;

    if (!replyText) {
      return NextResponse.json({ success: false, error: "Reply text is required" }, { status: 400 });
    }

    const updated = await ReviewService.replyToReview(id, replyText);
    return NextResponse.json({ success: true, message: "Reply added to review", data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
