import { NextResponse } from "next/server";
import { ContactService } from "@/services/contact.service";
import { ZodError } from "zod";
import { EnquiryStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as EnquiryStatus | null;

    const enquiries = await ContactService.getEnquiries(status || undefined);
    return NextResponse.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const enquiry = await ContactService.createEnquiry(body);

    return NextResponse.json({ success: true, message: "Contact enquiry received", data: enquiry }, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: (error as any).issues || (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
