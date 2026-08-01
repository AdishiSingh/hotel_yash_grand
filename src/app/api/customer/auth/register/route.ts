import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, createCustomerSession, CUSTOMER_COOKIE_NAME } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, password } = body;

    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, error: "Name, mobile number, and password are required." },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email ? email.trim().toLowerCase() : null;

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check if customer with phone or email already exists
    const existingPhone = await prisma.customer.findUnique({
      where: { phone: cleanPhone },
    });

    if (existingPhone && existingPhone.passwordHash) {
      return NextResponse.json(
        { success: false, error: "A customer account with this mobile number already exists. Please sign in instead." },
        { status: 400 }
      );
    }

    if (cleanEmail) {
      const existingEmail = await prisma.customer.findFirst({
        where: { email: cleanEmail },
      });

      if (existingEmail && existingEmail.passwordHash) {
        return NextResponse.json(
          { success: false, error: "A customer account with this email address already exists. Please sign in instead." },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await hashPassword(password);

    let customer;

    if (existingPhone) {
      const currentProvider = existingPhone.provider || "credentials";
      const updatedProvider = currentProvider.includes("credentials")
        ? currentProvider
        : `${currentProvider},credentials`;

      customer = await prisma.customer.update({
        where: { id: existingPhone.id },
        data: {
          name: cleanName,
          email: cleanEmail || existingPhone.email,
          passwordHash: hashedPassword,
          provider: updatedProvider,
        },
      });
    } else if (cleanEmail) {
      const existingEmail = await prisma.customer.findFirst({
        where: { email: cleanEmail },
      });

      if (existingEmail) {
        const currentProvider = existingEmail.provider || "google";
        const updatedProvider = currentProvider.includes("credentials")
          ? currentProvider
          : `${currentProvider},credentials`;

        const isGoogleGeneratedPhone = existingEmail.phone.startsWith("+9198") || existingEmail.phone.startsWith("+91-G-");

        customer = await prisma.customer.update({
          where: { id: existingEmail.id },
          data: {
            name: cleanName || existingEmail.name,
            phone: isGoogleGeneratedPhone ? cleanPhone : existingEmail.phone,
            passwordHash: hashedPassword,
            provider: updatedProvider,
          },
        });
      } else {
        customer = await prisma.customer.create({
          data: {
            name: cleanName,
            phone: cleanPhone,
            email: cleanEmail,
            passwordHash: hashedPassword,
            provider: "credentials",
          },
        });
      }
    } else {
      customer = await prisma.customer.create({
        data: {
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          passwordHash: hashedPassword,
          provider: "credentials",
        },
      });
    }

    // Create CustomerSession
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Browser";

    const { token, expiresAt } = await createCustomerSession(customer.id, ipAddress, userAgent);

    const response = NextResponse.json({
      success: true,
      message: "Customer account created successfully.",
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
    console.error("POST /api/customer/auth/register error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to register customer account." },
      { status: 500 }
    );
  }
}
