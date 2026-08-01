import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ success: false, error: "Verification token is required." }, { status: 400 });
    }

    const record = await prisma.emailVerification.findUnique({
      where: { token },
      include: { customer: true },
    });

    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: "Verification token is invalid or has expired." },
        { status: 400 }
      );
    }

    if (record.verifiedAt) {
      return NextResponse.json({
        success: true,
        message: "Email address is already verified.",
      });
    }

    // Mark verified
    await prisma.emailVerification.update({
      where: { id: record.id },
      data: { verifiedAt: new Date() },
    });

    await prisma.customer.update({
      where: { id: record.customerId },
      data: { isEmailVerified: true },
    });

    return NextResponse.json({
      success: true,
      message: "Email address verified successfully!",
    });
  } catch (error: any) {
    console.error("POST /api/customer/auth/verify-email error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
