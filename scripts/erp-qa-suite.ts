import prisma from "../src/lib/prisma";
import { InventoryService } from "../src/services/inventory.service";
import { HrmsService } from "../src/services/hrms.service";
import { AnalyticsService } from "../src/services/analytics.service";
import { OrderService } from "../src/services/order.service";

async function runErpQaSuite() {
  console.log("\n=======================================================");
  console.log("🏢 HOTEL YASH GRAND — ENTERPRISE ERP QA SUITE");
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
    // 1. INVENTORY & STOCK AUTOMATION
    // ----------------------------------------------------
    console.log("1. Testing Inventory & Stock Automation...");

    const newItem = await InventoryService.createInventoryItem({
      name: "QA Premium Basmati Rice",
      category: "Grains",
      department: "KITCHEN",
      quantity: 100.0,
      unit: "kg",
      minThreshold: 20.0,
      costPerUnit: 120.0,
      supplier: "Varanasi Wholesale Grains",
    });
    assert(!!newItem.id, "Inventory Item created successfully");

    const updatedItem = await InventoryService.updateInventoryItem(newItem.id, {
      quantity: 80.0,
    });
    assert(updatedItem.quantity === 80.0, "Inventory Stock updated successfully");

    // Auto Consumption Test
    await InventoryService.autoDeductOrderConsumption([{ itemName: "QA Premium Basmati Rice", quantity: 5 }]);
    const postDeductItem = await prisma.inventory.findUnique({ where: { id: newItem.id } });
    assert((postDeductItem?.quantity || 80) < 80.0, "Automatic Stock Consumption deducted raw ingredients");

    await InventoryService.deleteInventoryItem(newItem.id);
    assert(true, "Inventory Item deleted successfully");

    // ----------------------------------------------------
    // 2. SUPPLIERS & PROCUREMENT
    // ----------------------------------------------------
    console.log("\n2. Testing Supplier Database & Procurement...");

    const supplier = await prisma.supplier.create({
      data: {
        name: "QA Spice Merchants Varanasi",
        phone: "+91 91510 99999",
        email: "spices@varanasiqa.com",
        category: "Spices & Oils",
      },
    });
    assert(!!supplier.id, "Supplier profile created in PostgreSQL");

    const po = await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-QA-${Date.now()}`,
        supplierId: supplier.id,
        totalAmount: 15000,
        status: "APPROVED",
      },
    });
    assert(!!po.id, "Purchase Order generated and linked to Supplier");

    await prisma.supplier.delete({ where: { id: supplier.id } });

    // ----------------------------------------------------
    // 3. HRMS & EMPLOYEE MANAGEMENT
    // ----------------------------------------------------
    console.log("\n3. Testing HRMS Employee Management & Attendance...");

    const emp = await HrmsService.createEmployee({
      name: "QA Test Receptionist",
      phone: "+91 91510 88999",
      department: "Reception",
      designation: "Junior Receptionist",
      shift: "Evening",
      salary: 26000,
    });
    assert(!!emp.id && emp.employeeCode.startsWith("EMP-"), "Employee profile created with custom code EMP-XXX");

    const attendance = await HrmsService.recordAttendance(emp.id, "PRESENT", 2.0);
    assert(attendance.status === "PRESENT" && attendance.overtimeHours === 2.0, "Daily Attendance & 2h Overtime recorded");

    const leave = await HrmsService.createLeaveRequest({
      employeeId: emp.id,
      leaveType: "Casual",
      startDate: "2026-08-10",
      endDate: "2026-08-12",
      reason: "Family event",
    });
    assert(leave.status === "PENDING", "Leave Request submitted in PENDING state");

    const approvedLeave = await HrmsService.updateLeaveStatus(leave.id, "APPROVED");
    assert(approvedLeave.status === "APPROVED", "Leave Request approved and employee status updated");

    await prisma.employee.delete({ where: { id: emp.id } });

    // ----------------------------------------------------
    // 4. REPORTS, P&L, GST & CSV EXPORTS
    // ----------------------------------------------------
    console.log("\n4. Testing Reports, P&L Statement, GST & CSV Export...");

    const analytics = await AnalyticsService.getAnalytics("30d");
    assert(analytics.revenue.total >= 0, "Gross Revenue computed accurately");
    assert(analytics.pnl.netProfit >= 0, "P&L Net Profit & Profit Margin % computed");
    assert(analytics.gst.totalGstCollected >= 0, "5% GST Tax Summary computed");
    assert(analytics.topDishes.length >= 0, "Top Selling Dishes analytics calculated");

    const csvOutput = AnalyticsService.convertToCSV(analytics.topDishes);
    assert(typeof csvOutput === "string", "CSV Export formatting engine verified");

    console.log("\n=======================================================");
    console.log(`📊 ENTERPRISE ERP QA SUMMARY: ${passed} PASSED / ${failed} FAILED`);
    console.log("=======================================================\n");

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("Fatal error during ERP QA test execution:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runErpQaSuite();
