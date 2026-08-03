import { NextRequest, NextResponse } from "next/server";
import { getCustomerSessionFromRequest, createCustomerSession, CUSTOMER_COOKIE_NAME } from "@/lib/customer-auth";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    let session = await getCustomerSessionFromRequest(req);

    // If customer_token cookie is absent, fallback to NextAuth session (e.g. from Google OAuth)
    if (!session) {
      const nextAuthSession = await auth();
      if (nextAuthSession?.user?.email) {
        const cleanEmail = nextAuthSession.user.email.toLowerCase().trim();
        let customer = await prisma.customer.findUnique({
          where: { email: cleanEmail },
        });

        if (!customer) {
          const cleanName = nextAuthSession.user.name || cleanEmail.split("@")[0] || "Valued Guest";
          const cleanAvatar = nextAuthSession.user.image || "https://lh3.googleusercontent.com/a/default-user=s96-c";
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

        if (customer && customer.isActive) {
          const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";
          const userAgent = req.headers.get("user-agent") || "Browser (Google OAuth)";
          const newSession = await createCustomerSession(customer.id, ipAddress, userAgent);

          const response = NextResponse.json({
            success: true,
            authenticated: true,
            customer,
            sessionToken: newSession.token,
            expiresAt: newSession.expiresAt,
          });

          response.cookies.set(CUSTOMER_COOKIE_NAME, newSession.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: newSession.expiresAt,
            path: "/",
          });

          return response;
        }
      }
    }

    if (!session) {
      return NextResponse.json(
        { success: false, authenticated: false, customer: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      customer: session.customer,
      sessionToken: session.sessionToken,
      expiresAt: session.expiresAt,
    });
  } catch (error: any) {
    console.error("GET /api/customer/auth/me error:", error);
    return NextResponse.json(
      { success: false, authenticated: false, error: "Failed to retrieve session." },
      { status: 500 }
    );
  }
}
