import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCustomerSessionFromRequest } from "@/lib/customer-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getCustomerSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.customerSession.findMany({
      where: { customerId: session.customer.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      sessions,
      currentSessionToken: session.sessionToken,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCustomerSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("id");

    if (sessionId) {
      // Revoke specific session
      await prisma.customerSession.deleteMany({
        where: { id: sessionId, customerId: session.customer.id },
      });
    } else {
      // Revoke all OTHER sessions except current one
      await prisma.customerSession.deleteMany({
        where: {
          customerId: session.customer.id,
          sessionToken: { not: session.sessionToken },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Session(s) revoked successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
