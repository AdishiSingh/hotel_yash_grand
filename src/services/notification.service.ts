import prisma from "@/lib/prisma";
import { NotificationType } from "@prisma/client";
import { realtimeBus } from "@/lib/events";

export interface CreateNotificationInput {
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}

export class NotificationService {
  /**
   * Create & persist notification in PostgreSQL, then push real-time broadcast
   */
  public static async createNotification(input: CreateNotificationInput) {
    try {
      const notification = await prisma.notification.create({
        data: {
          title: input.title,
          message: input.message,
          type: input.type || NotificationType.INFO,
          link: input.link,
          isRead: false,
        },
      });

      // Broadcast real-time push event to connected clients
      realtimeBus.broadcast("NOTIFICATION_NEW", "CREATED", notification);

      return notification;
    } catch (err) {
      console.error("[NotificationService] Failed to create notification:", err);
      return null;
    }
  }

  /**
   * Get all notifications with optional unread filter
   */
  public static async getNotifications(params?: { isRead?: boolean; type?: NotificationType; limit?: number }) {
    const where: any = {};
    if (params?.isRead !== undefined) where.isRead = params.isRead;
    if (params?.type) where.type = params.type;

    return await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: params?.limit || 50,
    });
  }

  /**
   * Mark a single notification as read
   */
  public static async markAsRead(id: string) {
    return await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications as read
   */
  public static async markAllAsRead() {
    return await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
  }
}
