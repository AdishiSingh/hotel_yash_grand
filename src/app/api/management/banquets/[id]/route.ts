import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuditLogService } from "@/services/audit.service";
import { BanquetStatus } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, status, managerName, managerRemarks } = body;

    // 1. Update Banquet Event Status
    if (action === "update-banquet-status") {
      // First try updating BanquetBooking
      let updatedBooking = null;
      try {
        updatedBooking = await prisma.banquetBooking.update({
          where: { id },
          data: { status: status as BanquetStatus },
        });
      } catch (err) {
        // Fallback to BookingRequest if ID belongs to request
        updatedBooking = await prisma.bookingRequest.update({
          where: { id },
          data: {
            status,
            ...(managerRemarks && { managerRemarks }),
          },
        });
      }

      await AuditLogService.log({
        action: "BANQUET_STATUS_UPDATED",
        details: `Banquet event status updated to '${status}'. Remarks: ${managerRemarks || "N/A"}`,
      });

      return NextResponse.json({ success: true, booking: updatedBooking });
    }

    // 2. Assign Manager
    if (action === "assign-banquet-manager") {
      const updatedReq = await prisma.bookingRequest.update({
        where: { id },
        data: {
          assignedManager: managerName,
          assignedManagerRole: "BANQUET",
        },
      });

      await AuditLogService.log({
        action: "BANQUET_MANAGER_ASSIGNED",
        details: `Assigned manager ${managerName} to banquet request ${updatedReq.requestId}`,
      });

      return NextResponse.json({ success: true, request: updatedReq });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action specified." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("PATCH /api/management/banquets/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process banquet action." },
      { status: 500 }
    );
  }
}
