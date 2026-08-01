import prisma from "@/lib/prisma";

export interface LogAuditInput {
  userId?: string;
  action: string;
  details: string;
  ipAddress?: string;
}

export class AuditLogService {
  /**
   * Record security/operational audit event in PostgreSQL database
   */
  public static async log(input: LogAuditInput) {
    try {
      return await prisma.auditLog.create({
        data: {
          userId: input.userId || null,
          action: input.action,
          details: input.details,
          ipAddress: input.ipAddress || "127.0.0.1",
        },
      });
    } catch (err) {
      console.error("[AuditLogService] Failed to record audit log:", err);
      return null;
    }
  }

  /**
   * Retrieve recent audit logs for security compliance
   */
  public static async getRecentLogs(limit = 100) {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
      },
    });
  }
}
