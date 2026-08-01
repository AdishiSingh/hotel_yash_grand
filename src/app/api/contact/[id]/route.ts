import { NextResponse } from "next/server";
import { ContactService } from "@/services/contact.service";
import { EnquiryStatus } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const status = body.status as EnquiryStatus;

    if (!status) {
      return NextResponse.json({ success: false, error: "Enquiry status is required" }, { status: 400 });
    }

    const updated = await ContactService.updateEnquiryStatus(id, status);
    return NextResponse.json({ success: true, message: "Enquiry status updated", data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
