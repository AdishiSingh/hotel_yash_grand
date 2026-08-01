import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCustomerSessionFromRequest, comparePassword, hashPassword } from "@/lib/customer-auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await getCustomerSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Fetch customer with passwordHash
    const customer = await prisma.customer.findUnique({
      where: { id: session.customer.id },
    });

    if (!customer || !customer.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Customer password account not configured." },
        { status: 400 }
      );
    }

    const isCurrentValid = await comparePassword(currentPassword, customer.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    const newHashedPassword = await hashPassword(newPassword);

    await prisma.customer.update({
      where: { id: customer.id },
      data: { passwordHash: newHashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error: any) {
    console.error("PUT /api/customer/security error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update password." },
      { status: 500 }
    );
  }
}
