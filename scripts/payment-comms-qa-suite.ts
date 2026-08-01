import prisma from "../src/lib/prisma";
import { RazorpayService } from "../src/services/razorpay.service";
import { BillingService } from "../src/services/billing.service";
import { EmailService } from "../src/services/email.service";
import { WhatsAppService } from "../src/services/whatsapp.service";
import { CommunicationService } from "../src/services/communication.service";
import { OrderService } from "../src/services/order.service";

async function runPaymentCommsQaSuite() {
  console.log("\n=======================================================");
  console.log("💳 HOTEL YASH GRAND — PAYMENT & COMMS QA SUITE");
  console.log("=======================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, failureReason?: string) {
    if (condition) {
      passed++;
      console.log(`  ✓ PASSED: ${testName}`);
    } else {
      failed++;
      console.log(`  ❌ FAILED: ${testName} - ${failureReason}`);
    }
  }

  try {
    // ----------------------------------------------------
    // 1. PAYMENT METHODS & RAZORPAY INTEGRATION
    // ----------------------------------------------------
    console.log("1. Testing Payment Gateway & Razorpay Order Creation...");

    const rzpOrder = await RazorpayService.createOrder({
      amount: 1500,
      currency: "INR",
      paymentMethod: "RAZORPAY",
    });

    assert(!!rzpOrder.razorpayOrderId && rzpOrder.razorpayOrderId.startsWith("order_"), "Razorpay Order ID generated");
    assert(!!rzpOrder.paymentId && rzpOrder.paymentId.startsWith("PAY-"), "Custom Payment ID generated (PAY-YYYYMMDD-XXX)");
    assert(!!rzpOrder.invoiceNumber && rzpOrder.invoiceNumber.startsWith("INV-"), "Custom Invoice Number generated (INV-YYYYMMDD-XXX)");

    // HMAC Signature Verification Test
    const dummyPaymentId = "pay_test_999888777";
    const dummyOrderId = rzpOrder.razorpayOrderId;
    const isValidSig = RazorpayService.verifySignature({
      razorpayOrderId: dummyOrderId,
      razorpayPaymentId: dummyPaymentId,
      razorpaySignature: "invalid_sig",
    });
    assert(!isValidSig, "Cryptographic HMAC SHA256 Signature correctly rejects invalid payload");

    // ----------------------------------------------------
    // 2. GST CALCULATION ENGINE
    // ----------------------------------------------------
    console.log("\n2. Testing GST Tax Calculation Engine (5%)...");

    const gstBreakdown = BillingService.calculateGst(1000, 100); // 1000 - 100 = 900 taxable
    assert(gstBreakdown.taxableAmount === 900, "Taxable amount calculated correctly (₹900)");
    assert(gstBreakdown.cgstAmount === 22.5, "CGST (2.5%) calculated correctly (₹22.50)");
    assert(gstBreakdown.sgstAmount === 22.5, "SGST (2.5%) calculated correctly (₹22.50)");
    assert(gstBreakdown.totalGst === 45, "Total GST (5%) calculated correctly (₹45.00)");
    assert(gstBreakdown.grandTotal === 945, "Grand Total calculated correctly (₹945.00)");

    // ----------------------------------------------------
    // 3. REFUND & PARTIAL REFUND
    // ----------------------------------------------------
    console.log("\n3. Testing Refund & Partial Refund Engine...");

    const pendingPayment = await prisma.payment.findFirst();
    assert(!!pendingPayment, "Payment record exists in PostgreSQL for refund test");

    if (pendingPayment) {
      const partialRefund = await RazorpayService.processRefund(pendingPayment.id, 50, "Customer requested partial refund");
      assert(partialRefund.refundAmount === 50 && partialRefund.refundStatus === "PARTIAL_REFUND", "Partial Refund processed successfully");
    }

    // ----------------------------------------------------
    // 4. AUTOMATED EMAIL & WHATSAPP COMMUNICATIONS
    // ----------------------------------------------------
    console.log("\n4. Testing Automated Email & WhatsApp Communications...");

    const emailSent = await EmailService.sendRoomBookingEmail({
      guestName: "QA Guest Test",
      guestEmail: "yashgrand03nov@gmail.com",
      bookingId: "YG-BK-2026-999",
      roomName: "Royal Suite",
      checkIn: "2026-08-01",
      checkOut: "2026-08-03",
      totalAmount: 7000,
      advancePaid: 2000,
    });
    assert(emailSent, "Luxury HTML Email dispatch succeeded");

    const waSent = await WhatsAppService.sendBookingConfirmation({
      phone: "+919151088115",
      guestName: "QA Guest Test",
      bookingId: "YG-BK-2026-999",
      roomName: "Royal Suite",
      checkIn: "2026-08-01",
    });
    assert(waSent, "WhatsApp Cloud API template message dispatch succeeded");

    // ----------------------------------------------------
    // 5. DATABASE AUDIT & NOTIFICATION PERSISTENCE
    // ----------------------------------------------------
    console.log("\n5. Testing Database Records & Notification Persistence...");

    const auditLogsCount = await prisma.auditLog.count();
    assert(auditLogsCount > 0, "Audit logs stored in PostgreSQL database");

    const notifCount = await prisma.notification.count();
    assert(notifCount > 0, "Notifications stored in PostgreSQL database");

    console.log("\n=======================================================");
    console.log(`📊 PAYMENT & COMMS QA SUMMARY: ${passed} PASSED / ${failed} FAILED`);
    console.log("=======================================================\n");

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("Fatal error during Payment & Comms QA test execution:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPaymentCommsQaSuite();
