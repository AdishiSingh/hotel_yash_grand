import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const startTime = Date.now();

  try {
    // Test PostgreSQL database connectivity
    await prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Date.now() - startTime;

    const memoryUsage = process.memoryUsage();

    return NextResponse.json(
      {
        status: "HEALTHY",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          status: "CONNECTED",
          latencyMs: dbLatencyMs,
        },
        system: {
          memoryRssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
          heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "UNHEALTHY",
        timestamp: new Date().toISOString(),
        error: err.message || "Database healthcheck failed",
      },
      { status: 503 }
    );
  }
}
