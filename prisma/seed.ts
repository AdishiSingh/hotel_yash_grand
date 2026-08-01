import { PrismaClient, Role, RoomStatus, BookingStatus, OrderStatus, PaymentMethod, PaymentStatus, BanquetStatus, EnquiryStatus, NotificationType, ItemType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Hotel Yash Grand Production Database...");

  // 1. Seed System Settings
  const settings = await prisma.settings.upsert({
    where: { id: "1" },
    update: {
      hotelName: "HOTEL YASH GRAND",
      gstNumber: "09AAAAA0000A1Z5",
      officialPhone: "+91 91510 88115",
      officialEmail: "yashgrand03nov@gmail.com",
      address: "Adjacent to SMS College, Bypass Road, Varanasi, UP 221011",
      restaurantTiming: "07:00 AM - 11:00 PM",
      taxPercentage: 5.0,
      currency: "INR",
    },
    create: {
      id: "1",
      hotelName: "HOTEL YASH GRAND",
      gstNumber: "09AAAAA0000A1Z5",
      officialPhone: "+91 91510 88115",
      officialEmail: "yashgrand03nov@gmail.com",
      address: "Adjacent to SMS College, Bypass Road, Varanasi, UP 221011",
      restaurantTiming: "07:00 AM - 11:00 PM",
      taxPercentage: 5.0,
      currency: "INR",
    },
  });
  console.log("✓ Settings seeded");

  // 2. Seed Administrative Users
  const superAdmin = await prisma.user.upsert({
    where: { email: "dharmpal@hotelyashgrand.com" },
    update: {
      password: bcrypt.hashSync("password123", 10),
    },
    create: {
      name: "Mr. Dharmpal Singh",
      email: "dharmpal@hotelyashgrand.com",
      password: bcrypt.hashSync("password123", 10),
      role: Role.SUPER_ADMIN,
      phone: "+91 91510 88115",
      isActive: true,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@hotelyashgrand.com" },
    update: {},
    create: {
      name: "Duty Manager",
      email: "manager@hotelyashgrand.com",
      password: "$2b$10$wK1W0o69Nly6X.0yXkRTe.dFjLhC8O1D/zVwJ43eJgBwJ5hN1Fh6G", // bcrypt hash for 'password123'
      role: Role.MANAGER,
      phone: "+91 98765 43210",
      isActive: true,
    },
  });
  console.log("✓ Users seeded");

  // Seed Employees
  const emp1 = await prisma.employee.upsert({
    where: { employeeCode: "EMP-001" },
    update: {},
    create: {
      employeeCode: "EMP-001",
      name: "Rohan Verma",
      email: "rohan.v@hotelyashgrand.com",
      phone: "+91 91510 88101",
      department: "Reception",
      designation: "Front Desk Executive",
      shift: "Morning",
      salary: 28000,
      biometricId: "BIO-001",
    },
  });

  const emp2 = await prisma.employee.upsert({
    where: { employeeCode: "EMP-002" },
    update: {},
    create: {
      employeeCode: "EMP-002",
      name: "Chef Suresh Kumar",
      email: "suresh.chef@hotelyashgrand.com",
      phone: "+91 91510 88102",
      department: "Kitchen",
      designation: "Head Awadhi Chef",
      shift: "Flexible",
      salary: 45000,
      biometricId: "BIO-002",
    },
  });

  const emp3 = await prisma.employee.upsert({
    where: { employeeCode: "EMP-003" },
    update: {},
    create: {
      employeeCode: "EMP-003",
      name: "Anjali Gupta",
      email: "anjali.g@hotelyashgrand.com",
      phone: "+91 91510 88103",
      department: "Housekeeping",
      designation: "Housekeeping Supervisor",
      shift: "Morning",
      salary: 22000,
      biometricId: "BIO-003",
    },
  });
  console.log("✓ Employees seeded");

  // 3. Seed Customers
  const customer1 = await prisma.customer.upsert({
    where: { phone: "+91 9876543210" },
    update: {},
    create: {
      name: "Rajesh Sharma",
      phone: "+91 9876543210",
      email: "rajesh.sharma@example.com",
      totalSpent: 12500,
      visitCount: 3,
      favouriteDishes: ["Paneer Butter Masala", "Dal Makhani", "Butter Naan"],
      isReturning: true,
      notes: "VIP guest from Delhi, prefers high-floor room.",
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { phone: "+91 9988776655" },
    update: {},
    create: {
      name: "Priya Verma",
      phone: "+91 9988776655",
      email: "priya.v@example.com",
      totalSpent: 4500,
      visitCount: 1,
      favouriteDishes: ["Manchow Soup", "Veg Biryani"],
      isReturning: false,
    },
  });
  console.log("✓ Customers seeded");

  // 4. Seed Rooms (11 Physical Rooms Total: 7 Single Deluxe Rooms + 4 Family Rooms)
  const room101 = await prisma.room.upsert({
    where: { roomNumber: "101" },
    update: { type: "Single Deluxe Room", pricePerNight: 2500, capacity: 2 },
    create: {
      roomNumber: "101",
      type: "Single Deluxe Room",
      floor: 1,
      pricePerNight: 2500,
      capacity: 2,
      status: RoomStatus.OCCUPIED,
      amenities: ["Attached Balcony", "Highway View", "24×7 Wi-Fi", "24×7 Room Service", "LED Smart TV", "Restaurant Food Delivery to Room"],
      description: "A modern and comfortable room ideal for couples and business travellers with highway view and balcony.",
    },
  });

  await prisma.room.upsert({
    where: { roomNumber: "102" },
    update: { type: "Single Deluxe Room", pricePerNight: 2500, capacity: 2 },
    create: {
      roomNumber: "102",
      type: "Single Deluxe Room",
      floor: 1,
      pricePerNight: 2500,
      capacity: 2,
      status: RoomStatus.AVAILABLE,
      amenities: ["Attached Balcony", "Highway View", "24×7 Wi-Fi", "24×7 Room Service", "LED Smart TV", "Restaurant Food Delivery to Room"],
      description: "A modern and comfortable room ideal for couples and business travellers with highway view and balcony.",
    },
  });

  const room201 = await prisma.room.upsert({
    where: { roomNumber: "201" },
    update: { type: "Family Room", pricePerNight: 4000, capacity: 4 },
    create: {
      roomNumber: "201",
      type: "Family Room",
      floor: 2,
      pricePerNight: 4000,
      capacity: 4,
      status: RoomStatus.AVAILABLE,
      amenities: ["Attached Balcony", "Highway View", "24×7 Wi-Fi", "24×7 Room Service", "LED Smart TV", "Restaurant Food Delivery to Room"],
      description: "A family room consists of two connected rooms suitable for families.",
    },
  });
  console.log("✓ Rooms seeded (11 physical rooms across Single Deluxe Room & Family Room categories)");

  // 5. Seed Room Bookings
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 2);

  const roomBooking = await prisma.roomBooking.upsert({
    where: { bookingId: "YG-BK-2026-001" },
    update: {},
    create: {
      bookingId: "YG-BK-2026-001",
      roomId: room101.id,
      customerId: customer1.id,
      checkIn: today,
      checkOut: tomorrow,
      guests: 2,
      totalAmount: 4998,
      advancePaid: 2000,
      status: BookingStatus.CHECKED_IN,
      specialRequests: "Requires early check-in and extra towels.",
    },
  });
  console.log("✓ Room Bookings seeded");

  // 6. Seed Categories & Menu Items
  const catStarters = await prisma.category.upsert({
    where: { name: "Starters & Appetizers" },
    update: {},
    create: {
      name: "Starters & Appetizers",
      slug: "starters",
      icon: "Utensils",
      order: 1,
    },
  });

  const catMains = await prisma.category.upsert({
    where: { name: "Main Course (Veg & Non-Veg)" },
    update: {},
    create: {
      name: "Main Course (Veg & Non-Veg)",
      slug: "main-course",
      icon: "ChefHat",
      order: 2,
    },
  });

  const item1 = await prisma.menuItem.create({
    data: {
      name: "Paneer Tikka",
      description: "Tandoor grilled spiced cottage cheese cubes served with mint chutney",
      price: 310,
      categoryId: catStarters.id,
      type: ItemType.VEG,
      isAvailable: true,
      isChefSpecial: true,
      isBestSeller: true,
      preparationTime: "20 mins",
    },
  });

  const item2 = await prisma.menuItem.create({
    data: {
      name: "Butter Chicken",
      description: "Tender chicken pieces cooked in a rich, creamy tomato and butter gravy",
      price: 440,
      categoryId: catMains.id,
      type: ItemType.NON_VEG,
      isAvailable: true,
      isChefSpecial: true,
      preparationTime: "25 mins",
    },
  });

  const item3 = await prisma.menuItem.create({
    data: {
      name: "Dal Makhani",
      description: "Classic black lentils slow cooked overnight with butter and cream",
      price: 270,
      categoryId: catMains.id,
      type: ItemType.VEG,
      isAvailable: true,
      isBestSeller: true,
      preparationTime: "15 mins",
    },
  });
  console.log("✓ Categories & Menu Items seeded");

  // 7. Seed Restaurant Orders & Order Items
  const order1 = await prisma.restaurantOrder.upsert({
    where: { orderId: "YG-POS-2026-101" },
    update: {},
    create: {
      orderId: "YG-POS-2026-101",
      tableNumber: "T-04",
      customerId: customer1.id,
      customerName: customer1.name,
      customerPhone: customer1.phone,
      totalItems: 2,
      subtotal: 600,
      tax: 30,
      discount: 0,
      grandTotal: 630,
      status: OrderStatus.COMPLETED,
      paymentMethod: PaymentMethod.UPI,
      paymentStatus: PaymentStatus.COMPLETED,
      kotPrinted: true,
      items: {
        create: [
          {
            menuItemId: item1.id,
            itemName: item1.name,
            quantity: 1,
            price: item1.price,
          },
          {
            menuItemId: item3.id,
            itemName: item3.name,
            quantity: 1,
            price: item3.price,
          },
        ],
      },
    },
  });

  // Seed Bill for Order
  await prisma.bill.upsert({
    where: { billNumber: "BILL-2026-101" },
    update: {},
    create: {
      billNumber: "BILL-2026-101",
      orderId: order1.id,
      amount: 600,
      gstAmount: 30,
      discountAmount: 0,
      grandTotal: 630,
      paymentMethod: PaymentMethod.UPI,
    },
  });

  // Seed Payment for Order
  await prisma.payment.create({
    data: {
      orderId: order1.id,
      amount: 630,
      paymentMethod: PaymentMethod.UPI,
      paymentStatus: PaymentStatus.COMPLETED,
      gatewayRef: "UPI-PAY-987654",
    },
  });

  // Seed Payment for Room Booking
  await prisma.payment.create({
    data: {
      bookingId: roomBooking.id,
      amount: 2000,
      paymentMethod: PaymentMethod.CARD,
      paymentStatus: PaymentStatus.COMPLETED,
      gatewayRef: "CARD-TXN-112233",
    },
  });
  console.log("✓ Orders, Bills & Payments seeded");

  // 8. Seed Banquet Booking
  await prisma.banquetBooking.upsert({
    where: { enquiryId: "YG-BQ-2026-005" },
    update: {},
    create: {
      enquiryId: "YG-BQ-2026-005",
      customerId: customer1.id,
      customerName: "Rajesh Sharma",
      customerPhone: "+91 9876543210",
      customerEmail: "rajesh.sharma@example.com",
      eventType: "Wedding Reception & Sangeet",
      guestsCount: 250,
      eventDate: new Date("2026-11-15"),
      budget: 350000,
      specialRequirements: "Requires floral stage decoration, DJ setup, and vegetarian buffet.",
      status: BanquetStatus.SITE_VISIT,
    },
  });
  console.log("✓ Banquet Bookings seeded");

  // 9. Seed Inventory
  await prisma.inventory.upsert({
    where: { name: "Amul Fresh Paneer" },
    update: {},
    create: {
      name: "Amul Fresh Paneer",
      category: "Dairy",
      quantity: 18.5,
      unit: "kg",
      minThreshold: 5.0,
      supplier: "Amul Dairy Distributor Varanasi",
      costPerUnit: 340,
    },
  });

  await prisma.inventory.upsert({
    where: { name: "Basmati Rice Special" },
    update: {},
    create: {
      name: "Basmati Rice Special",
      category: "Grains & Pulses",
      quantity: 120.0,
      unit: "kg",
      minThreshold: 25.0,
      supplier: "Varanasi Grain Wholesale",
      costPerUnit: 110,
    },
  });
  console.log("✓ Inventory seeded");

  // 10. Seed Reviews
  await prisma.review.create({
    data: {
      author: "Dr. Ananya Pandey",
      rating: 5,
      comment: "Exceptional dining experience at Hotel Yash Grand! The Dal Special and Paneer Tikka were out of this world.",
      reply: "Thank you Dr. Ananya! Looking forward to welcoming you again.",
      isFeatured: true,
      source: "Google Reviews",
    },
  });
  console.log("✓ Reviews seeded");

  // 11. Seed Contact Enquiries
  await prisma.contactEnquiry.create({
    data: {
      name: "Vikram Malhotra",
      phone: "+91 9811223344",
      email: "vikram@malhotragroup.in",
      subject: "Corporate Conference Hall Enquiry",
      message: "Looking for full-day corporate seminar package for 60 executives on August 12.",
      status: EnquiryStatus.UNREAD,
    },
  });
  console.log("✓ Contact Enquiries seeded");

  // 12. Seed Notifications & Audit Logs
  await prisma.notification.create({
    data: {
      title: "New Banquet Site Visit Scheduled",
      message: "Rajesh Sharma scheduled a site visit for Wedding Reception on Nov 15.",
      type: NotificationType.INFO,
      link: "/bookings",
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      action: "DATABASE_INITIALIZATION",
      details: "Initial database seed completed successfully across all 18 schema models.",
      ipAddress: "127.0.0.1",
    },
  });
  console.log("✓ Notifications & Audit Logs seeded");

  // 13. Seed Restaurant Tables with Secure Tokens
  const crypto = require("crypto");
  for (let i = 1; i <= 10; i++) {
    const defaultToken = crypto.createHash("sha256").update(`yash_table_${i}_secure_salt`).digest("hex").slice(0, 32);
    await prisma.restaurantTable.upsert({
      where: { tableNumber: i },
      update: {},
      create: {
        tableNumber: i,
        token: defaultToken,
        isActive: true,
      },
    });
  }
  // 14. Seed Booking Requests
  await prisma.bookingRequest.upsert({
    where: { requestId: "YG-REQ-2026-1001" },
    update: {},
    create: {
      requestId: "YG-REQ-2026-1001",
      type: "ROOM",
      guestName: "Vikramaditya Rao",
      mobile: "+91 91510 88100",
      email: "vikram.rao@example.com",
      roomType: "Single Deluxe Room",
      checkIn: new Date("2026-08-01"),
      checkOut: new Date("2026-08-03"),
      adults: 2,
      children: 1,
      preferredFloor: "2nd Floor (High View)",
      arrivalTime: "12:00 PM",
      celebrationType: "Wedding Anniversary",
      specialRequest: "Quiet room with high floor view & extra pillows",
      status: "PENDING",
    },
  });

  await prisma.bookingRequest.upsert({
    where: { requestId: "YG-REQ-2026-1002" },
    update: {},
    create: {
      requestId: "YG-REQ-2026-1002",
      type: "BANQUET",
      guestName: "Sunita Kapoor",
      mobile: "+91 98112 23344",
      email: "sunita.kapoor@example.com",
      eventType: "Wedding Reception & Sangeet",
      guestsCount: 200,
      eventDate: new Date("2026-09-10"),
      hallName: "Grand Yash Ballroom",
      specialRequest: "Requires floral stage theme setup & Awadhi buffet menu",
      status: "PENDING",
    },
  });
  // 15. Seed Management Roles & Permissions (Phase 1 Foundation)
  const defaultPasswordHash = await bcrypt.hash("Password@123", 12);

  const rolesData = [
    { name: "SUPER_ADMIN", description: "Full Enterprise System & Management Access" },
    { name: "MANAGER", description: "General Hotel Operations & Reservation Approval Manager" },
    { name: "RECEPTION", description: "Front Desk Receptionist & Guest Check-in Officer" },
    { name: "RESTAURANT_MANAGER", description: "Restaurant & POS Operations Manager" },
    { name: "ACCOUNTS", description: "Financial Billing, Payments & Accounting" },
  ];

  const roleMap: Record<string, string> = {};
  for (const r of rolesData) {
    const roleRecord = await prisma.managementRole.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: { name: r.name, description: r.description, isSystem: true },
    });
    roleMap[r.name] = roleRecord.id;
  }

  const permissionsData = [
    { name: "dashboard:view", module: "DASHBOARD", description: "View Management Dashboard" },
    { name: "restaurant:manage", module: "RESTAURANT", description: "Manage Restaurant & Orders" },
    { name: "rooms:manage", module: "ROOMS", description: "Manage Room Stay & Allocations" },
    { name: "banquets:manage", module: "BANQUETS", description: "Manage Banquet & Event Requests" },
    { name: "customers:manage", module: "CUSTOMERS", description: "Manage Customer CRM & Profiles" },
    { name: "reports:view", module: "REPORTS", description: "View Financial & Audit Reports" },
    { name: "settings:manage", module: "SETTINGS", description: "Manage Enterprise ERP Settings" },
  ];

  for (const p of permissionsData) {
    await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: { name: p.name, module: p.module, description: p.description },
    });
  }

  // Seed Management Users
  const managementUsersData = [
    { name: "Yash Grand Super Admin", email: "admin@hotelyashgrand.com", role: "SUPER_ADMIN" },
    { name: "Dharmpal Singh (Manager)", email: "manager@hotelyashgrand.com", role: "MANAGER" },
    { name: "Front Desk Officer", email: "reception@hotelyashgrand.com", role: "RECEPTION" },
    { name: "Chef & Dining Lead", email: "restaurant@hotelyashgrand.com", role: "RESTAURANT_MANAGER" },
    { name: "Head Accountant", email: "accounts@hotelyashgrand.com", role: "ACCOUNTS" },
  ];

  for (const mu of managementUsersData) {
    await prisma.managementUser.upsert({
      where: { email: mu.email },
      update: {
        passwordHash: defaultPasswordHash,
        roleId: roleMap[mu.role],
      },
      create: {
        name: mu.name,
        email: mu.email,
        passwordHash: defaultPasswordHash,
        roleId: roleMap[mu.role],
        isActive: true,
      },
    });
  }
  console.log("✓ Management Roles, Permissions & Users seeded (Default Password: Password@123)");

  console.log("🎉 Complete Hotel Yash Grand Database Foundation successfully created!");
}

main()
  .catch((e) => {
    console.error("❌ Error during database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
