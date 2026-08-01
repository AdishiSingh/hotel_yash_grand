import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Reset token and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { customer: true },
    });

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: "Password reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    // Update customer password and mark reset token used
    await prisma.$transaction([
      prisma.customer.update({
        where: { id: resetRecord.customerId },
        data: { passwordHash: hashedPassword },
      }),
      prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now sign in with your new password.",
    });
  } catch (error: any) {
    console.error("POST /api/customer/auth/reset-password error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset password." },
      { status: 500 }
    );
  }
}
