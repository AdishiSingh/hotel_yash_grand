import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, createCustomerSession, CUSTOMER_COOKIE_NAME } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body; // identifier can be email or phone

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Email or mobile number, and password are required." },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim();

    // Search by email or phone
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier.toLowerCase() },
          { phone: cleanIdentifier },
        ],
      },
    });

    if (!customer || !customer.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials or customer account does not exist." },
        { status: 401 }
      );
    }

    if (!customer.isActive) {
      return NextResponse.json(
        { success: false, error: "Your customer account is currently inactive. Please contact hotel support." },
        { status: 403 }
      );
    }

    const isPasswordValid = await comparePassword(password, customer.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email/phone or password." },
        { status: 401 }
      );
    }

    // Create session
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Browser";

    const { token, expiresAt } = await createCustomerSession(customer.id, ipAddress, userAgent);

    // Update last login and visit dates
    await prisma.customer.update({
      where: { id: customer.id },
      data: { lastLogin: new Date(), lastVisit: new Date() },
    }).catch(() => {});

    const response = NextResponse.json({
      success: true,
      message: "Signed in successfully.",
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        avatar: customer.avatar,
      },
    });

    response.cookies.set(CUSTOMER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("POST /api/customer/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sign in." },
      { status: 500 }
    );
  }
}
