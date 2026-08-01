import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/services/notification.service";
import { NotificationType } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unread") === "true";
    const typeStr = searchParams.get("type");

    const notifications = await NotificationService.getNotifications({
      isRead: unreadOnly ? false : undefined,
      type: typeStr ? (typeStr as NotificationType) : undefined,
      limit: 100,
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.markAll) {
      await NotificationService.markAllAsRead();
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    if (body.id) {
      await NotificationService.markAsRead(body.id);
      return NextResponse.json({ success: true, message: "Notification marked as read" });
    }

    return NextResponse.json({ success: false, error: "Missing notification id or markAll flag" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update notification" },
      { status: 500 }
    );
  }
}
