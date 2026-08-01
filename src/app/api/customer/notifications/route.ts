import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCustomerSessionFromRequest } from "@/lib/customer-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getCustomerSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const customerId = session.customer.id;

    // Fetch notifications specifically for this customer or global notifications
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { customerId },
          { customerId: null },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error: any) {
    console.error("GET /api/customer/notifications error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCustomerSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({ markAllRead: true }));
    const { notificationId, markAllRead = true } = body;

    const customerId = session.customer.id;

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: {
          OR: [{ customerId }, { customerId: null }],
          isRead: false,
        },
        data: { isRead: true },
      });
    } else if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Notifications updated successfully.",
    });
  } catch (error: any) {
    console.error("PUT /api/customer/notifications error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCustomerSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, message, type = "INFO", link } = body;

    if (!title || !message) {
      return NextResponse.json({ success: false, error: "Title and message are required." }, { status: 400 });
    }

    const notification = await prisma.notification.create({
      data: {
        customerId: session.customer.id,
        title: title.trim(),
        message: message.trim(),
        type,
        link: link || "/customer/dashboard",
      },
    });

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error: any) {
    console.error("POST /api/customer/notifications error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
