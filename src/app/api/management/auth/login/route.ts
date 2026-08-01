import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, createLoginSession, MANAGEMENT_COOKIE_NAME } from "@/lib/management-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are mandatory." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Find user in PostgreSQL
    const user = await prisma.managementUser.findUnique({
      where: { email: cleanEmail },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials or inactive account." },
        { status: 401 }
      );
    }

    // 2. Validate password hash via bcrypt
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 3. Create LoginSession in PostgreSQL
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Browser";

    const { token, expiresAt } = await createLoginSession(user.id, ipAddress, userAgent);

    const permissions = user.role.permissions.map((rp) => rp.permission.name);

    // 4. Create HTTP Response with HTTP-Only Cookie
    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        permissions,
      },
    });

    response.cookies.set(MANAGEMENT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("POST /api/management/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
