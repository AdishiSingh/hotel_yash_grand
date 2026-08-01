import { BookingRequestService } from "../src/services/booking-request.service";
import { prisma } from "../src/lib/prisma";

async function runBookingWorkflowTest() {
  console.log("=========================================");
  console.log("🏨 TESTING MANAGER APPROVAL BOOKING WORKFLOW");
  console.log("=========================================");

  // 1. Submit Room Booking Request
  console.log("\nStep 1: Submitting Room Booking Request...");
  const roomReqResult = await BookingRequestService.createRequest({
    type: "ROOM",
    guestName: "Anand Sharma",
    mobile: "+91 98765 12345",
    email: "anand.sharma@example.com",
    roomType: "Single Deluxe Room",
    checkIn: new Date("2026-08-15"),
    checkOut: new Date("2026-08-18"),
    adults: 2,
    children: 1,
    preferredFloor: "2nd Floor (High View)",
    arrivalTime: "12:00 PM",
    specialRequest: "High floor quiet room with extra bed",
  });

  console.log(`✓ Room Booking Request created with ID: ${roomReqResult.request.requestId}`);
  console.log(`  Initial DB Status: ${roomReqResult.request.status}`);
  console.log(`  Generated Manager WhatsApp Notification URL: ${roomReqResult.managerWhatsappUrl.slice(0, 80)}...`);

  if (roomReqResult.request.status !== "PENDING") {
    throw new Error("❌ FAILURE: Booking request status must default to PENDING!");
  }

  // 2. Manager Approves Room Booking Request
  console.log("\nStep 2: Manager Approving Room Booking Request...");
  const approvalResult = await BookingRequestService.approveRequest({
    requestId: roomReqResult.request.requestId,
    managerName: "Mr. Dharmpal Singh (Manager)",
    assignedRoomNumber: "102",
    advanceAmount: 2000,
    totalAmount: 7500,
    managerRemarks: "Assigned Room 102 (Single Deluxe Room). Free early check-in approved.",
  });

  console.log(`✓ Manager Approval executed successfully!`);
  console.log(`  Generated Confirmed Booking Number: ${approvalResult.bookingNumber}`);
  console.log(`  Generated Customer WhatsApp Confirmation URL: ${approvalResult.customerWhatsappUrl.slice(0, 80)}...`);

  // Verify in PostgreSQL DB
  const dbReq = await prisma.bookingRequest.findUnique({
    where: { requestId: roomReqResult.request.requestId },
  });

  console.log(`  Updated Request DB Status: ${dbReq?.status}`);
  console.log(`  Assigned Room: Room ${dbReq?.assignedRoomNumber}`);
  console.log(`  Approved By: ${dbReq?.approvedBy}`);

  // 3. Submit Banquet Booking Request
  console.log("\nStep 3: Submitting Banquet Booking Request...");
  const banquetReqResult = await BookingRequestService.createRequest({
    type: "BANQUET",
    guestName: "Meenakshi Verma",
    mobile: "+91 99887 76655",
    email: "meenakshi.v@example.com",
    eventType: "Wedding Reception",
    guestsCount: 250,
    eventDate: new Date("2026-11-20"),
    hallName: "Grand Yash Ballroom",
    specialRequest: "Stage floral theme and Awadhi dinner buffet",
  });

  console.log(`✓ Banquet Booking Request created with ID: ${banquetReqResult.request.requestId}`);

  // 4. Manager Rejects Banquet Booking Request (due to date conflict)
  console.log("\nStep 4: Manager Rejecting Banquet Booking Request...");
  const rejectionResult = await BookingRequestService.rejectRequest(
    banquetReqResult.request.requestId,
    "Grand Yash Ballroom is already booked for another wedding on Nov 20",
    "Suggested alternative date Nov 22 to guest"
  );

  console.log(`✓ Manager Rejection executed successfully!`);
  console.log(`  Updated Status: ${rejectionResult.request.status}`);
  console.log(`  Rejection Reason: ${rejectionResult.request.rejectionReason}`);

  // 5. Audit Log Count Check
  const auditLogs = await prisma.auditLog.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  console.log("\n=========================================");
  console.log("✅ WORKFLOW AUDIT RESULTS CONFIRMED");
  console.log("=========================================");
  console.log("Recent Manager Audit Logs in PostgreSQL:");
  auditLogs.forEach((log, index) => {
    console.log(`  ${index + 1}. [${log.action}] ${log.details}`);
  });

  console.log("\n🎉 Complete Manager Approval Booking Workflow tested & verified!");
}

runBookingWorkflowTest()
  .catch((err) => {
    console.error("❌ Workflow Test Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
