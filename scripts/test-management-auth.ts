import { prisma } from "../src/lib/prisma";
import { comparePassword, createLoginSession, getManagementSession } from "../src/lib/management-auth";

async function runManagementAuthTest() {
  console.log("=========================================");
  console.log("🔒 TESTING PHASE 1 MANAGEMENT PORTAL AUTH & RBAC");
  console.log("=========================================");

  // 1. Query Roles from PostgreSQL
  console.log("\nStep 1: Querying Management Roles from PostgreSQL...");
  const roles = await prisma.managementRole.findMany({
    include: {
      users: true,
      permissions: { include: { permission: true } },
    },
  });

  console.log(`✓ Total Management Roles found: ${roles.length}`);
  roles.forEach((r) => {
    console.log(`  • Role: ${r.name} (${r.users.length} users, ${r.permissions.length} permissions)`);
  });

  const expectedRoles = ["SUPER_ADMIN", "MANAGER", "RECEPTION", "RESTAURANT_MANAGER", "ACCOUNTS"];
  for (const roleName of expectedRoles) {
    const found = roles.find((r) => r.name === roleName);
    if (!found) {
      throw new Error(`❌ Missing mandatory role: ${roleName}`);
    }
  }

  // 2. Test Super Admin Authentication via bcrypt
  console.log("\nStep 2: Testing Super Admin Password Hash Verification (bcrypt)...");
  const adminUser = await prisma.managementUser.findUnique({
    where: { email: "admin@hotelyashgrand.com" },
    include: { role: true },
  });

  if (!adminUser) {
    throw new Error("❌ Super Admin user admin@hotelyashgrand.com not found in PostgreSQL!");
  }

  const isPasswordValid = await comparePassword("Password@123", adminUser.passwordHash);
  console.log(`✓ bcrypt password match result for admin@hotelyashgrand.com: ${isPasswordValid}`);

  if (!isPasswordValid) {
    throw new Error("❌ bcrypt password comparison failed!");
  }

  // 3. Test LoginSession Creation in PostgreSQL
  console.log("\nStep 3: Creating LoginSession record in PostgreSQL...");
  const { session, token } = await createLoginSession(adminUser.id, "127.0.0.1", "Test Script Agent");
  console.log(`✓ LoginSession created with token: ${token.slice(0, 30)}...`);

  // 4. Validate Management Session
  console.log("\nStep 4: Validating Management Session from Token...");
  const validatedSession = await getManagementSession(token);
  if (!validatedSession) {
    throw new Error("❌ Management session validation failed!");
  }

  console.log(`✓ Session Validated Successfully!`);
  console.log(`  User: ${validatedSession.user.name} (${validatedSession.user.email})`);
  console.log(`  Role: ${validatedSession.user.role}`);
  console.log(`  Permissions Count: ${validatedSession.user.permissions.length}`);

  // 5. Clean up test session
  await prisma.loginSession.delete({ where: { id: session.id } });

  console.log("\n=========================================");
  console.log("✅ PHASE 1 MANAGEMENT PORTAL AUTHENTICATION TEST PASSED");
  console.log("=========================================");
  console.log("PostgreSQL Management Users count: ", await prisma.managementUser.count());
  console.log("PostgreSQL Management Roles count: ", await prisma.managementRole.count());
  console.log("PostgreSQL Management Permissions count: ", await prisma.permission.count());
}

runManagementAuthTest()
  .catch((err) => {
    console.error("❌ Test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
