import { OrderService } from "../src/services/order.service";
import { prisma } from "../src/lib/prisma";

async function runVerificationAudit() {
  console.log("=========================================");
  console.log("🔍 COMPLETE POSTGRESQL ORDER CREATION AUDIT");
  console.log("=========================================");

  // 1. Verify Database Connection URL
  console.log("Step 1: Verifying PostgreSQL connection...");
  const dbUrl = process.env.DATABASE_URL;
  console.log(`DATABASE_URL configured: ${dbUrl?.replace(/:[^:@]+@/, ":****@")}`);

  const initialCount = await prisma.restaurantOrder.count();
  const initialItemCount = await prisma.orderItem.count();
  console.log(`Initial DB count in PostgreSQL: ${initialCount} orders, ${initialItemCount} order items.`);

  // 2. Prepare payload mimicking frontend order submission
  const testPayload = {
    tableNumber: "T-05",
    customerName: "Audit Test Customer",
    customerPhone: "+91 91510 88115",
    paymentMethod: "UPI" as const,
    discount: 50,
    items: [
      {
        menuItemId: "custom-menu-item-1",
        itemName: "Paneer Tikka",
        quantity: 2,
        price: 320,
        variantLabel: "Full Plate",
      },
      {
        menuItemId: "custom-menu-item-2",
        itemName: "Butter Naan",
        quantity: 4,
        price: 45,
      },
    ],
  };

  console.log("\nStep 2: Invoking OrderService.createOrder (POST /api/orders pipeline)...");
  const createdOrder = await OrderService.createOrder(testPayload);

  console.log("\nStep 3: Verifying newly created order object returned by Prisma transaction:");
  console.log(`- Order DB ID: ${createdOrder.id}`);
  console.log(`- Order Number / Order ID: ${createdOrder.orderId}`);
  console.log(`- Table Number: ${createdOrder.tableNumber}`);
  console.log(`- Grand Total: ₹${createdOrder.grandTotal}`);
  console.log(`- Order Items Count: ${createdOrder.items.length}`);

  // 3. Query PostgreSQL directly to confirm persistence
  console.log("\nStep 4: Querying PostgreSQL directly to confirm record persistence...");
  const persistedOrder = await prisma.restaurantOrder.findUnique({
    where: { id: createdOrder.id },
    include: {
      items: true,
      bill: true,
      customer: true,
    },
  });

  if (!persistedOrder) {
    throw new Error("❌ FAILURE: Order was not found in PostgreSQL database!");
  }

  const finalCount = await prisma.restaurantOrder.count();
  const finalItemCount = await prisma.orderItem.count();

  console.log("\n=========================================");
  console.log("✅ AUDIT RESULTS: ORDER PERSISTENCE CONFIRMED");
  console.log("=========================================");
  console.log(`Order ID: ${persistedOrder.orderId}`);
  console.log(`Table: ${persistedOrder.tableNumber}`);
  console.log(`Customer: ${persistedOrder.customerName} (${persistedOrder.customerPhone})`);
  console.log(`Status: ${persistedOrder.status}`);
  console.log(`Subtotal: ₹${persistedOrder.subtotal}`);
  console.log(`Tax: ₹${persistedOrder.tax}`);
  console.log(`Discount: ₹${persistedOrder.discount}`);
  console.log(`Grand Total: ₹${persistedOrder.grandTotal}`);
  console.log("\nSaved Order Items in PostgreSQL:");
  persistedOrder.items.forEach((item, index) => {
    console.log(`  ${index + 1}. [${item.id}] ${item.itemName} x${item.quantity} @ ₹${item.price} = ₹${item.quantity * item.price}`);
  });

  console.log(`\nPostgreSQL Order count changed from ${initialCount} -> ${finalCount} (+${finalCount - initialCount})`);
  console.log(`PostgreSQL OrderItem count changed from ${initialItemCount} -> ${finalItemCount} (+${finalItemCount - initialItemCount})`);
  console.log("\n🎉 Database update confirmed successfully!");
}

runVerificationAudit()
  .catch((err) => {
    console.error("❌ Verification Audit Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
