import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuditLogService } from "@/services/audit.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [{ id }, { phone: id }],
      },
      include: {
        orders: {
          include: { items: true },
          orderBy: { createdAt: "desc" },
        },
        roomBookings: {
          include: { room: true },
          orderBy: { checkIn: "desc" },
        },
        banquetBookings: {
          orderBy: { eventDate: "desc" },
        },
        bookingRequests: {
          include: {
            communicationLogs: { orderBy: { createdAt: "desc" } },
            managerNotes: { orderBy: { createdAt: "desc" } },
          },
          orderBy: { requestedAt: "desc" },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer profile not found." },
        { status: 404 }
      );
    }

    const isVip = customer.visitCount >= 3 || customer.totalSpent >= 20000;

    return NextResponse.json({
      success: true,
      customer,
      isVip,
    });
  } catch (error: any) {
    console.error("GET /api/management/customers/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch customer profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { notes, favouriteDishes } = body;

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        ...(notes !== undefined && { notes }),
        ...(favouriteDishes && { favouriteDishes }),
      },
    });

    await AuditLogService.log({
      action: "CUSTOMER_PROFILE_UPDATED",
      details: `Updated CRM profile for customer ${updated.name} (${updated.phone}).`,
    });

    return NextResponse.json({ success: true, customer: updated });
  } catch (error: any) {
    console.error("PATCH /api/management/customers/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update customer notes." },
      { status: 500 }
    );
  }
}
