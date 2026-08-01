import prisma from "@/lib/prisma";
import { realtimeBus } from "@/lib/events";
import { Logger } from "@/lib/logger";

export interface SreAlert {
  id: string;
  type: "CRITICAL" | "WARNING" | "INFO";
  component: string;
  message: string;
  triggeredAt: string;
}

export class TelemetryService {
  /**
   * Collect real-time telemetry metrics
   */
  public static async getMetrics() {
    const memory = process.memoryUsage();
    const heapUsedMb = Math.round(memory.heapUsed / (1024 * 1024));
    const heapTotalMb = Math.round(memory.heapTotal / (1024 * 1024));
    const memoryPercent = Math.round((heapUsedMb / Math.max(1, heapTotalMb)) * 100);

    const activeSseListeners = realtimeBus.listenerCount("event");

    const failedPayments = await prisma.payment.count({
      where: { paymentStatus: "FAILED" },
    });

    const totalLogs = await prisma.auditLog.count();

    const alerts: SreAlert[] = [];

    if (memoryPercent > 85) {
      alerts.push({
        id: `alert-mem-${Date.now()}`,
        type: "WARNING",
        component: "MEMORY",
        message: `High Memory Usage Detected: ${memoryPercent}% (${heapUsedMb}MB used)`,
        triggeredAt: new Date().toISOString(),
      });
    }

    if (failedPayments > 5) {
      alerts.push({
        id: `alert-pay-${Date.now()}`,
        type: "CRITICAL",
        component: "PAYMENTS",
        message: `Elevated Payment Failures: ${failedPayments} failed transaction records detected`,
        triggeredAt: new Date().toISOString(),
      });
    }

    return {
      server: {
        status: "ONLINE",
        uptimeSeconds: Math.round(process.uptime()),
        memory: {
          heapUsedMb,
          heapTotalMb,
          memoryPercent,
        },
        nodeVersion: process.version,
      },
      realtimeBus: {
        activeListeners: activeSseListeners,
      },
      database: {
        status: "HEALTHY",
        totalAuditLogs: totalLogs,
        failedPaymentsCount: failedPayments,
      },
      alerts,
    };
  }
}
