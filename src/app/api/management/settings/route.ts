import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/management-auth";
import { AuditLogService } from "@/services/audit.service";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    // 1. Fetch System Settings from PostgreSQL
    let settings = await prisma.settings.findUnique({
      where: { id: "1" },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: "1",
          hotelName: "HOTEL YASH GRAND",
          gstNumber: "09AAAAA0000A1Z5",
          officialPhone: "+91 91510 88115",
          officialEmail: "contact@hotelyashgrand.com",
          address: "Lucknow Road, Near District Hospital, Gonda, Uttar Pradesh 271001",
          taxPercentage: 5.0,
          currency: "INR",
        },
      });
    }

    // 2. Fetch Staff Accounts & Roles
    const staffAccounts = await prisma.managementUser.findMany({
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const roles = await prisma.managementRole.findMany({
      include: {
        permissions: { include: { permission: true } },
      },
    });

    const permissions = await prisma.permission.findMany({
      orderBy: { name: "asc" },
    });

    // 3. Fetch Restaurant Tables & QR Tokens
    const tables = await prisma.restaurantTable.findMany({
      orderBy: { tableNumber: "asc" },
    });

    // 4. Fetch Audit & Security Logs
    const auditLogs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
    });

    const loginSessions = await prisma.loginSession.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      settings,
      staffAccounts,
      roles,
      permissions,
      tables,
      auditLogs,
      loginSessions,
    });
  } catch (error: any) {
    console.error("GET /api/management/settings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch management settings." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // A. Update Hotel Information & Tax Settings
    if (action === "update-hotel-info") {
      const { hotelName, gstNumber, officialPhone, officialEmail, address, taxPercentage, currency } = body;

      const updatedSettings = await prisma.settings.upsert({
        where: { id: "1" },
        update: {
          hotelName,
          gstNumber,
          officialPhone,
          officialEmail,
          address,
          taxPercentage: parseFloat(taxPercentage),
          currency,
        },
        create: {
          id: "1",
          hotelName,
          gstNumber,
          officialPhone,
          officialEmail,
          address,
          taxPercentage: parseFloat(taxPercentage),
          currency,
        },
      });

      await AuditLogService.log({
        action: "HOTEL_SETTINGS_UPDATED",
        details: `Updated hotel settings: ${hotelName}, Tax: ${taxPercentage}%, GST: ${gstNumber}`,
      });

      return NextResponse.json({ success: true, settings: updatedSettings });
    }

    // B. Create or Update Staff User Account
    if (action === "save-staff-account") {
      const { userId, name, email, phone, roleName, password, isActive } = body;

      const roleRecord = await prisma.managementRole.findUnique({
        where: { name: roleName },
      });

      if (!roleRecord) {
        return NextResponse.json({ success: false, error: `Role ${roleName} not found.` }, { status: 400 });
      }

      let user = null;
      if (userId) {
        // Edit existing staff user
        const updateData: any = {
          name,
          email,
          phone,
          roleId: roleRecord.id,
          isActive,
        };
        if (password && password.trim() !== "") {
          updateData.passwordHash = await hashPassword(password);
        }

        user = await prisma.managementUser.update({
          where: { id: userId },
          data: updateData,
        });
      } else {
        // Create new staff user
        if (!password) {
          return NextResponse.json({ success: false, error: "Password is required for new staff account." }, { status: 400 });
        }
        const passwordHash = await hashPassword(password);
        user = await prisma.managementUser.create({
          data: {
            name,
            email,
            phone,
            passwordHash,
            roleId: roleRecord.id,
            isActive: isActive !== undefined ? isActive : true,
          },
        });
      }

      await AuditLogService.log({
        action: "STAFF_ACCOUNT_SAVED",
        details: `Saved staff user ${name} (${email}) with role ${roleName}`,
      });

      return NextResponse.json({ success: true, user });
    }

    // C. Regenerate Restaurant Table QR Token
    if (action === "regenerate-qr-token") {
      const { tableId } = body;
      const newToken = `token_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

      const updatedTable = await prisma.restaurantTable.update({
        where: { id: tableId },
        data: { token: newToken },
      });

      await AuditLogService.log({
        action: "TABLE_QR_TOKEN_REGENERATED",
        details: `Regenerated QR token for Table ${updatedTable.tableNumber}`,
      });

      return NextResponse.json({ success: true, table: updatedTable });
    }

    return NextResponse.json({ success: false, error: "Invalid action specified." }, { status: 400 });
  } catch (error: any) {
    console.error("PUT /api/management/settings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update settings." },
      { status: 500 }
    );
  }
}
