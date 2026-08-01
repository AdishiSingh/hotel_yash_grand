import { NextResponse } from "next/server";
import { ReviewService } from "@/services/review.service";
import { ZodError } from "zod";

export async function GET() {
  try {
    const reviews = await ReviewService.getReviews();
    return NextResponse.json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const review = await ReviewService.createReview(body);

    return NextResponse.json({ success: true, message: "Review submitted successfully", data: review }, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: (error as any).issues || (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
