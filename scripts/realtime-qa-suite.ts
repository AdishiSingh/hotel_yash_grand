import { realtimeBus, RealtimeEventPayload } from "../src/lib/events";
import { NotificationService } from "../src/services/notification.service";
import { OrderService } from "../src/services/order.service";
import { BookingService } from "../src/services/booking.service";
import { InventoryService } from "../src/services/inventory.service";
import prisma from "../src/lib/prisma";

async function runRealtimeQaSuite() {
  console.log("\n=======================================================");
  console.log("⚡ HOTEL YASH GRAND — REALTIME & PERFORMANCE QA SUITE");
  console.log("=======================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, failureDetails?: string) {
    if (condition) {
      passed++;
      console.log(`  ✓ PASSED: ${testName}`);
    } else {
      failed++;
      console.log(`  ❌ FAILED: ${testName} - ${failureDetails}`);
    }
  }

  try {
    // ----------------------------------------------------
    // 1. MULTI-LISTENER & BUS EMISSION TEST
    // ----------------------------------------------------
    console.log("1. Testing Event Bus & Multi-Client Listener Performance...");

    let receivedCount = 0;
    const clientCount = 5;
    const listenerFns: Array<(payload: RealtimeEventPayload) => void> = [];

    // Simulate 5 concurrent connected clients
    for (let i = 0; i < clientCount; i++) {
      const fn = (payload: RealtimeEventPayload) => {
        if (payload.type === "DASHBOARD_REFRESH") {
          receivedCount++;
        }
      };
      listenerFns.push(fn);
      realtimeBus.on("event", fn);
    }

    // Broadcast event
    realtimeBus.broadcast("DASHBOARD_REFRESH", "QA_TEST_PING");

    assert(receivedCount === clientCount, `Event broadcast received simultaneously by all ${clientCount} simulated clients`);

    // Clean up listeners to prevent memory leaks
    listenerFns.forEach((fn) => realtimeBus.removeListener("event", fn));
    assert(realtimeBus.listenerCount("event") === 0, "Listeners cleaned up properly (No Memory Leaks)");

    // ----------------------------------------------------
    // 2. LIVE STATUS SYNC (ORDERS & KITCHEN KDS)
    // ----------------------------------------------------
    console.log("\n2. Testing Live Status Sync (Orders & Kitchen KDS)...");

    const menuItems = await prisma.menuItem.findMany({ take: 1 });
    assert(menuItems.length > 0, "Menu item exists for realtime order test");

    let orderEventFired = false;
    const orderListener = (payload: RealtimeEventPayload) => {
      if (payload.type === "ORDER_UPDATED" && payload.action === "CREATED") {
        orderEventFired = true;
      }
    };
    realtimeBus.on("event", orderListener);

    const testOrder = await OrderService.createOrder({
      tableNumber: "T-QA-REALTIME",
      customerName: "Realtime Tester",
      customerPhone: "+91 9991112223",
      items: [{ menuItemId: menuItems[0].id, itemName: menuItems[0].name, quantity: 1, price: menuItems[0].price }],
      discount: 0,
      paymentMethod: "CASH",
    });

    assert(orderEventFired, "Order creation fired instant ORDER_UPDATED realtime broadcast");

    // Clean up test order
    await OrderService.deleteOrder(testOrder.id);
    realtimeBus.removeListener("event", orderListener);

    // ----------------------------------------------------
    // 3. ROOM OCCUPANCY & BOOKING SYNC
    // ----------------------------------------------------
    console.log("\n3. Testing Room Occupancy & Booking Realtime Sync...");

    let bookingEventFired = false;
    const bookingListener = (payload: RealtimeEventPayload) => {
      if (payload.type === "BOOKING_UPDATED") {
        bookingEventFired = true;
      }
    };
    realtimeBus.on("event", bookingListener);

    const room = await prisma.room.findFirst({ where: { status: "AVAILABLE" } });
    if (room) {
      const today = new Date();
      const inDate = new Date(today);
      inDate.setDate(today.getDate() + 20);
      const outDate = new Date(today);
      outDate.setDate(today.getDate() + 22);

      const booking = await BookingService.createBooking({
        roomId: room.id,
        customerName: "Realtime Guest",
        customerPhone: "+91 9991112224",
        checkIn: inDate.toISOString().split("T")[0],
        checkOut: outDate.toISOString().split("T")[0],
        guests: 2,
        totalAmount: 4000,
        advancePaid: 1000,
      });

      assert(bookingEventFired, "Booking creation fired BOOKING_UPDATED realtime broadcast");
      await BookingService.deleteBooking(booking.id);
    } else {
      assert(true, "Booking test skipped (no available rooms)");
    }
    realtimeBus.removeListener("event", bookingListener);

    // ----------------------------------------------------
    // 4. INVENTORY STOCK REALTIME SYNC
    // ----------------------------------------------------
    console.log("\n4. Testing Inventory Stock Realtime Sync...");

    let inventoryEventFired = false;
    const invListener = (payload: RealtimeEventPayload) => {
      if (payload.type === "INVENTORY_UPDATED") {
        inventoryEventFired = true;
      }
    };
    realtimeBus.on("event", invListener);

    const invItem = await InventoryService.createInventoryItem({
      name: "QA Realtime Saffron",
      category: "Spices",
      quantity: 5.0,
      unit: "kg",
      minThreshold: 10.0,
      supplier: "QA Supplier",
    });

    assert(inventoryEventFired, "Inventory update fired INVENTORY_UPDATED realtime broadcast");
    await InventoryService.deleteInventoryItem(invItem.id);
    realtimeBus.removeListener("event", invListener);

    // ----------------------------------------------------
    // 5. NOTIFICATION PERSISTENCE & TOAST PUSH
    // ----------------------------------------------------
    console.log("\n5. Testing Notification Persistence & Realtime Toast Push...");

    let notifPushReceived = false;
    const notifListener = (payload: RealtimeEventPayload) => {
      if (payload.type === "NOTIFICATION_NEW") {
        notifPushReceived = true;
      }
    };
    realtimeBus.on("event", notifListener);

    const notif = await NotificationService.createNotification({
      title: "Realtime QA Notification",
      message: "Automated test notification payload",
      type: "SUCCESS",
    });

    assert(!!notif?.id, "Notification persisted into PostgreSQL database");
    assert(notifPushReceived, "New Notification fired NOTIFICATION_NEW realtime toast push");
    realtimeBus.removeListener("event", notifListener);

    console.log("\n=======================================================");
    console.log(`📊 REALTIME QA SUMMARY: ${passed} PASSED / ${failed} FAILED`);
    console.log("=======================================================\n");

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("Fatal error during Realtime QA test suite execution:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runRealtimeQaSuite();
