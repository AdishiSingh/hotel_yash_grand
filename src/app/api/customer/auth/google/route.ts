import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createCustomerSession, CUSTOMER_COOKIE_NAME } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, avatar, googleId, callbackUrl } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address is required for Google authentication." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name?.trim() || "Google Guest";
    const cleanAvatar = avatar || `https://lh3.googleusercontent.com/a/default-user=s96-c`;
    const cleanGoogleId = googleId || `google-sub-${Date.now()}`;

    let customer = await prisma.customer.findUnique({
      where: { email: cleanEmail },
    });

    if (customer) {
      // MERGE INTO EXISTING CUSTOMER PROFILE
      const currentProvider = customer.provider || "credentials";
      const updatedProvider = currentProvider.includes("google")
        ? currentProvider
        : `${currentProvider},google`;

      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: customer.name || cleanName,
          avatar: cleanAvatar || customer.avatar,
          isEmailVerified: true,
          provider: updatedProvider,
          lastLogin: new Date(),
        },
      });
    } else {
      // AUTOMATICALLY CREATE NEW CUSTOMER PROFILE FROM GOOGLE OAUTH
      const generatedPhone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;

      customer = await prisma.customer.create({
        data: {
          name: cleanName,
          email: cleanEmail,
          phone: generatedPhone,
          avatar: cleanAvatar,
          isEmailVerified: true,
          provider: "google",
          lastLogin: new Date(),
        },
      });
    }

    // LINK GOOGLE OAUTH ACCOUNT RECORD TO CUSTOMER
    const existingAccount = await prisma.account.findFirst({
      where: { provider: "google", providerAccountId: cleanGoogleId },
    });

    if (!existingAccount) {
      await prisma.account.create({
        data: {
          customerId: customer.id,
          type: "oauth",
          provider: "google",
          providerAccountId: cleanGoogleId,
          scope: "openid profile email",
        },
      }).catch((e) => console.warn("Google account link notice:", e));
    }

    // ISSUE HTTP-ONLY CUSTOMER SESSION
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Browser (Google OAuth)";

    const { token, expiresAt } = await createCustomerSession(customer.id, ipAddress, userAgent);

    const response = NextResponse.json({
      success: true,
      message: "Successfully signed in via Google Account.",
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        avatar: customer.avatar,
        provider: customer.provider,
        isEmailVerified: customer.isEmailVerified,
      },
      callbackUrl: callbackUrl || "/",
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
    console.error("POST /api/customer/auth/google error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Google authentication failed." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const name = searchParams.get("name") || "Google Guest";
    const avatar = searchParams.get("avatar") || "https://lh3.googleusercontent.com/a/default-user=s96-c";
    const googleId = searchParams.get("googleId") || `google-sub-${Date.now()}`;
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    if (!email) {
      return NextResponse.redirect(new URL("/?auth_error=MissingEmail", req.url));
    }

    const cleanEmail = email.trim().toLowerCase();
    let customer = await prisma.customer.findUnique({
      where: { email: cleanEmail },
    });

    if (customer) {
      const currentProvider = customer.provider || "credentials";
      const updatedProvider = currentProvider.includes("google")
        ? currentProvider
        : `${currentProvider},google`;

      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: customer.name || name,
          avatar: avatar || customer.avatar,
          isEmailVerified: true,
          provider: updatedProvider,
          lastLogin: new Date(),
        },
      });
    } else {
      const generatedPhone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;
      customer = await prisma.customer.create({
        data: {
          name,
          email: cleanEmail,
          phone: generatedPhone,
          avatar,
          isEmailVerified: true,
          provider: "google",
          lastLogin: new Date(),
        },
      });
    }

    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Browser (Google OAuth)";

    const { token, expiresAt } = await createCustomerSession(customer.id, ipAddress, userAgent);

    const redirectUrl = new URL(callbackUrl, req.url);
    redirectUrl.searchParams.set("auth_success", "google");

    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set(CUSTOMER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("GET /api/customer/auth/google error:", error);
    return NextResponse.redirect(new URL("/?auth_error=GoogleAuthFailed", req.url));
  }
}
