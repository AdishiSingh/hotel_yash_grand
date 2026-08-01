import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createPasswordResetToken } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier } = body; // email or phone

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: "Email or mobile number is required." },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim();

    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier.toLowerCase() },
          { phone: cleanIdentifier },
        ],
      },
    });

    if (!customer) {
      // For security, return success message even if email/phone not found
      return NextResponse.json({
        success: true,
        message: "If an account matches that information, password reset instructions have been generated.",
      });
    }

    const resetToken = await createPasswordResetToken(customer.id);

    // Build reset URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/customer/forgot-password?token=${resetToken.token}`;

    return NextResponse.json({
      success: true,
      message: "Password reset token generated successfully.",
      resetToken: resetToken.token,
      resetUrl,
    });
  } catch (error: any) {
    console.error("POST /api/customer/auth/forgot-password error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process password reset request." },
      { status: 500 }
    );
  }
}
