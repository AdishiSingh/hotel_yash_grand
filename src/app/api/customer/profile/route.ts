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

    // Fetch full profile with active sessions & notifications count
    const [customer, activeSessions, notifications] = await Promise.all([
      prisma.customer.findUnique({
        where: { id: customerId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          address: true,
          city: true,
          state: true,
          pincode: true,
          idProofType: true,
          idProofNumber: true,
          favouriteRoom: true,
          specialRequests: true,
          preferredFloor: true,
          preferredCheckInTime: true,
          savedGuests: true,
          isEmailVerified: true,
          isPhoneVerified: true,
          totalSpent: true,
          visitCount: true,
          lastVisit: true,
          createdAt: true,
        },
      }),
      prisma.customerSession.findMany({
        where: { customerId, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.findMany({
        where: {
          OR: [{ customerId }, { customerId: null }],
        },
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      customer,
      activeSessions,
      notifications,
    });
  } catch (error: any) {
    console.error("GET /api/customer/profile error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCustomerSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      name, 
      phone, 
      email, 
      avatar,
      address, 
      city, 
      state, 
      pincode, 
      idProofType, 
      idProofNumber,
      favouriteRoom,
      specialRequests,
      preferredFloor,
      preferredCheckInTime,
      favouriteDishes,
      savedGuests
    } = body;

    const targetName = (name && name.trim()) || session.customer.name;
    const targetPhone = (phone && phone.trim()) || session.customer.phone;

    if (!targetName || !targetPhone) {
      return NextResponse.json(
        { success: false, error: "Name and mobile number cannot be empty." },
        { status: 400 }
      );
    }

    const cleanPhone = targetPhone;
    const cleanEmail = email !== undefined ? (email ? email.trim().toLowerCase() : null) : session.customer.email;

    // Check unique constraints for phone or email if changed
    if (cleanPhone !== session.customer.phone) {
      const existingPhone = await prisma.customer.findUnique({ where: { phone: cleanPhone } });
      if (existingPhone && existingPhone.id !== session.customer.id) {
        return NextResponse.json(
          { success: false, error: "This mobile number is already linked to another account." },
          { status: 400 }
        );
      }
    }

    if (cleanEmail && cleanEmail !== session.customer.email) {
      const existingEmail = await prisma.customer.findFirst({ where: { email: cleanEmail } });
      if (existingEmail && existingEmail.id !== session.customer.id) {
        return NextResponse.json(
          { success: false, error: "This email address is already linked to another account." },
          { status: 400 }
        );
      }
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: session.customer.id },
      data: {
        name: targetName,
        phone: cleanPhone,
        email: cleanEmail,
        avatar: avatar ? avatar.trim() : null,
        address: address ? address.trim() : null,
        city: city ? city.trim() : null,
        state: state ? state.trim() : null,
        pincode: pincode ? pincode.trim() : null,
        idProofType: idProofType ? idProofType.trim() : null,
        idProofNumber: idProofNumber ? idProofNumber.trim() : null,
        favouriteRoom: favouriteRoom ? favouriteRoom.trim() : null,
        specialRequests: specialRequests ? specialRequests.trim() : null,
        preferredFloor: preferredFloor ? preferredFloor.trim() : null,
        preferredCheckInTime: preferredCheckInTime ? preferredCheckInTime.trim() : null,
        ...(favouriteDishes !== undefined ? { favouriteDishes: Array.isArray(favouriteDishes) ? favouriteDishes : [] } : {}),
        savedGuests: savedGuests ? savedGuests : [],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        idProofType: true,
        idProofNumber: true,
        favouriteRoom: true,
        specialRequests: true,
        preferredFloor: true,
        preferredCheckInTime: true,
        favouriteDishes: true,
        savedGuests: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully in PostgreSQL.",
      customer: updatedCustomer,
    });
  } catch (error: any) {
    console.error("PUT /api/customer/profile error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
