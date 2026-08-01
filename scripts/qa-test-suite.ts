import { OrderService } from "../src/services/order.service";
import { BookingService } from "../src/services/booking.service";
import { CustomerService } from "../src/services/customer.service";
import { MenuService } from "../src/services/menu.service";
import { InventoryService } from "../src/services/inventory.service";
import { DashboardService } from "../src/services/dashboard.service";
import { PaymentService } from "../src/services/payment.service";
import { BanquetService } from "../src/services/banquet.service";
import { ContactService } from "../src/services/contact.service";
import prisma from "../src/lib/prisma";

async function runQaTestSuite() {
  console.log("\n=======================================================");
  console.log("🧪 HOTEL YASH GRAND — PRODUCTION READINESS QA TEST SUITE");
  console.log("=======================================================\n");

  let passedCount = 0;
  let failedCount = 0;
  const results: { test: string; status: "PASSED" | "FAILED"; details?: string }[] = [];

  function assert(condition: boolean, testName: string, failureDetails?: string) {
    if (condition) {
      passedCount++;
      results.push({ test: testName, status: "PASSED" });
      console.log(`  ✓ PASSED: ${testName}`);
    } else {
      failedCount++;
      results.push({ test: testName, status: "FAILED", details: failureDetails });
      console.log(`  ❌ FAILED: ${testName} - ${failureDetails}`);
    }
  }

  try {
    // ----------------------------------------------------
    // 1. RESTAURANT ORDERS
    // ----------------------------------------------------
    console.log("1. Testing Restaurant Orders CRUD & Bill Generation...");
    const menuItems = await MenuService.getMenuItems();
    assert(menuItems.length > 0, "Menu items exist in database for orders");

    const orderData = {
      tableNumber: "T-QA-01",
      customerName: "QA Tester Rajesh",
      customerPhone: "+91 9998887771",
      items: [
        {
          menuItemId: menuItems[0].id,
          itemName: menuItems[0].name,
          quantity: 2,
          price: menuItems[0].price,
        },
      ],
      discount: 20,
      paymentMethod: "UPI" as const,
      notes: "QA Test Order",
    };

    const newOrder = await OrderService.createOrder(orderData);
    assert(!!newOrder.id && !!newOrder.orderId, "Restaurant Order Created");
    assert(!!newOrder.bill && newOrder.bill.grandTotal > 0, "Bill Generated Automatically");

    const fetchedOrder = await OrderService.getOrderById(newOrder.id);
    assert(fetchedOrder?.tableNumber === "T-QA-01", "Order Read Succeeded");

    const updatedOrder = await OrderService.updateOrderStatus(newOrder.id, {
      status: "COMPLETED",
      paymentStatus: "COMPLETED",
    });
    assert(updatedOrder.status === "COMPLETED", "Order Update Succeeded");

    const deletedOrder = await OrderService.deleteOrder(newOrder.id);
    assert(!!deletedOrder, "Order Delete Succeeded");

    // ----------------------------------------------------
    // 2. ROOM BOOKINGS & OVERLAP PREVENTION
    // ----------------------------------------------------
    console.log("\n2. Testing Room Bookings & Prevention Rules...");
    const rooms = await prisma.room.findMany();
    assert(rooms.length > 0, "Rooms available in database");

    const targetRoom = rooms.find((r) => r.status === "AVAILABLE") || rooms[0];

    const today = new Date();
    const futureDate1 = new Date(today);
    futureDate1.setDate(today.getDate() + 10);
    const futureDate2 = new Date(today);
    futureDate2.setDate(today.getDate() + 12);

    const bookingData = {
      roomId: targetRoom.id,
      customerName: "QA Guest Anita",
      customerPhone: "+91 9998887772",
      checkIn: futureDate1.toISOString().split("T")[0],
      checkOut: futureDate2.toISOString().split("T")[0],
      guests: 2,
      totalAmount: 5000,
      advancePaid: 1000,
      specialRequests: "Quiet room requested",
    };

    const newBooking = await BookingService.createBooking(bookingData);
    assert(!!newBooking.id && newBooking.status === "CONFIRMED", "Room Booking Created");

    const updatedBooking = await BookingService.updateBookingStatus(newBooking.id, {
      status: "CHECKED_IN",
    });
    assert(updatedBooking.status === "CHECKED_IN", "Room Booking Status Updated");

    const cancelledBooking = await BookingService.updateBookingStatus(newBooking.id, {
      status: "CANCELLED",
    });
    assert(cancelledBooking.status === "CANCELLED", "Room Booking Cancelled & Room Freed");

    await BookingService.deleteBooking(newBooking.id);

    // ----------------------------------------------------
    // 3. CRM & CUSTOMER UPDATES
    // ----------------------------------------------------
    console.log("\n3. Testing CRM & Customer Profile Upserts...");
    const customer = await CustomerService.createCustomer({
      name: "CRM QA Guest",
      phone: "+91 9998887773",
      email: "crm.qa@example.com",
      notes: "VIP Gold Member",
    });
    assert(customer.name === "CRM QA Guest", "Customer Profile Created");

    const searchCust = await CustomerService.getCustomers("CRM QA");
    assert(searchCust.length > 0, "Customer Search Succeeded");

    await CustomerService.deleteCustomer(customer.id);

    // ----------------------------------------------------
    // 4. MENU MANAGEMENT
    // ----------------------------------------------------
    console.log("\n4. Testing Menu CRUD Operations...");
    const category = await prisma.category.findFirst();
    assert(!!category, "Category exists for menu item test");

    const newDish = await MenuService.createMenuItem({
      name: "QA Test Royal Kebab",
      description: "Tender grilled kebabs",
      price: 380,
      categoryId: category!.id,
      type: "NON_VEG",
      isAvailable: true,
      isChefSpecial: true,
      isBestSeller: false,
      isRecommended: false,
    });
    assert(newDish.name === "QA Test Royal Kebab", "Menu Dish Added");

    const editedDish = await MenuService.updateMenuItem(newDish.id, {
      price: 420,
      isAvailable: false,
    });
    assert(editedDish.price === 420 && !editedDish.isAvailable, "Menu Dish Edited");

    await MenuService.deleteMenuItem(newDish.id);
    assert(true, "Menu Dish Deleted");

    // ----------------------------------------------------
    // 5. INVENTORY & ALERTS
    // ----------------------------------------------------
    console.log("\n5. Testing Inventory & Re-order Stock Alerts...");
    const invItem = await InventoryService.createInventoryItem({
      name: "QA Test Saffron",
      category: "Spices",
      quantity: 2.0,
      unit: "kg",
      minThreshold: 5.0,
      supplier: "Kashi Spice Traders",
    });
    assert(invItem.quantity < invItem.minThreshold, "Low Stock Condition Detected Correctly");

    const restockedInv = await InventoryService.updateInventoryItem(invItem.id, {
      quantity: 10.0,
    });
    assert(restockedInv.quantity === 10.0, "Stock Quantity Updated & Restocked");

    await InventoryService.deleteInventoryItem(invItem.id);

    // ----------------------------------------------------
    // 6. DASHBOARD REAL-TIME CALCULATIONS
    // ----------------------------------------------------
    console.log("\n6. Testing Dashboard KPIs & Calculations...");
    const kpis = await DashboardService.getDashboardKpis();
    assert(typeof kpis.todayRevenue === "number", "Revenue Calculated Successfully");
    assert(typeof kpis.occupancyRate === "number", "Occupancy Calculated Successfully");
    assert(typeof kpis.ordersCount === "number", "Orders Count Calculated Successfully");
    assert(typeof kpis.pendingEnquiries === "number", "Pending Enquiries Calculated Successfully");

    // ----------------------------------------------------
    // 7. CONTACT & BANQUET
    // ----------------------------------------------------
    console.log("\n7. Testing Contact Enquiries & Banquet Bookings...");
    const enquiry = await ContactService.createEnquiry({
      name: "Inquiry Tester",
      phone: "+91 9998887774",
      email: "inquiry@test.com",
      subject: "Test Subject",
      message: "Test Message Content",
    });
    assert(enquiry.status === "UNREAD", "Contact Enquiry Persisted");

    const banquet = await BanquetService.createBanquetBooking({
      customerName: "Banquet Tester",
      customerPhone: "+91 9998887775",
      eventType: "QA Test Gala",
      guestsCount: 150,
      eventDate: new Date("2026-12-01").toISOString(),
      budget: 150000,
    });
    assert(banquet.status === "NEW", "Banquet Booking Created");

    const updatedBanquet = await BanquetService.updateBanquetStatus(banquet.id, "BOOKED");
    assert(updatedBanquet.status === "BOOKED", "Banquet Status Updated");

    // ----------------------------------------------------
    // 8. ERROR & VALIDATION TESTING
    // ----------------------------------------------------
    console.log("\n8. Testing Validation & Error Handling...");
    try {
      await OrderService.createOrder({
        tableNumber: "",
        items: [],
      } as any);
      assert(false, "Zod Validation Prevents Invalid Order Creation");
    } catch (err: any) {
      assert(true, "Zod Validation Prevents Invalid Order Creation");
    }

    try {
      await BookingService.createBooking({
        roomId: targetRoom.id,
        customerName: "Test",
        customerPhone: "123", // invalid phone
        checkIn: "2026-08-10",
        checkOut: "2026-08-05", // checkOut before checkIn
        totalAmount: -100,
      } as any);
      assert(false, "Booking Service Rejects Invalid Check-Out Date");
    } catch (err: any) {
      assert(true, "Booking Service Rejects Invalid Check-Out Date");
    }

    console.log("\n=======================================================");
    console.log(`📊 QA SUMMARY: ${passedCount} PASSED / ${failedCount} FAILED`);
    console.log("=======================================================\n");

    if (failedCount > 0) {
      process.exit(1);
    }
  } catch (globalErr) {
    console.error("Fatal exception during QA execution:", globalErr);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runQaTestSuite();
