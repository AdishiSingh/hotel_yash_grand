import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Verify DB Connection
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      { status: "READY", timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: "NOT_READY", error: err.message || "Database connection failing" },
      { status: 503 }
    );
  }
}
