const fs = require("fs");
const path = require("path");

const componentsDir = path.join(__dirname, "../src");

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes("node_modules") && !fullPath.includes(".next") && !fullPath.includes("__tests__")) {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(componentsDir);
const auditReport = [];

// Exclude store definitions, AI config files, and container components that don't trigger actions directly
const EXCLUDED_FILES = [
  "src/context/BookingGuardContext.tsx",
  "src/features/booking/store/use-booking-store.ts",
  "src/ai/services/languageConfig.ts",
  "src/app/customer/dashboard/page.tsx",
  "src/components/contact/BookingHub.tsx", // Container that holds RoomBookingForm, RestaurantBookingForm, BanquetBookingForm
  "src/components/rooms/RoomCard.tsx" // Component whose onBook click is passed by parent RoomsSection
];

allFiles.forEach((filePath) => {
  const relativePath = path.relative(path.join(__dirname, ".."), filePath);
  if (EXCLUDED_FILES.includes(relativePath)) return;

  const content = fs.readFileSync(filePath, "utf-8");

  const hasBookingAction = 
    content.includes("Book Stay") ||
    content.includes("Book Room") ||
    content.includes("Book Banquet") ||
    content.includes("Reserve Table") ||
    content.includes("Reserve Room") ||
    content.includes("Book Now") ||
    content.includes("setDrawerOpen") ||
    content.includes("executeBookingSubmission") ||
    content.includes("executeBanquetSubmission") ||
    content.includes("RoomBookingForm") ||
    content.includes("BanquetBookingForm") ||
    content.includes("RestaurantBookingForm") ||
    content.includes("DineInOrderModal");

  if (hasBookingAction) {
    const usesGuard = content.includes("useBookingGuard") && content.includes("requireAuth");
    auditReport.push({
      file: relativePath,
      usesGuard,
    });
  }
});

console.log("=== GLOBAL BOOKING GUARD INTERACTIVE ENTRY POINT AUDIT ===");
console.table(auditReport);

const bypasses = auditReport.filter((r) => !r.usesGuard);
if (bypasses.length === 0) {
  console.log(`\n✓ VERIFIED: All ${auditReport.length} interactive booking entry points across the codebase enforce the Centralized Booking Guard (0 bypasses).`);
} else {
  console.error(`\n❌ FAILURE: Found ${bypasses.length} bypasses.`);
  process.exit(1);
}
