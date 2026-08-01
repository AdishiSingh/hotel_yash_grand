const fs = require("fs");
const path = require("path");

const MENU_FILE_PATH = path.join(__dirname, "../src/data/menu.ts");
const PUBLIC_DIR = path.join(__dirname, "../public");
const PUBLIC_FOOD_DIR = path.join(PUBLIC_DIR, "assets/food");
const SCRATCH_DIR = path.join(__dirname, "../scratch");
if (!fs.existsSync(SCRATCH_DIR)) {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });
}

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      if (file !== ".DS_Store") {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

function normalizeStr(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function runAudit() {
  const logLines = [];
  function log(msg = "") {
    console.log(msg);
    logLines.push(msg);
  }

  log("==================================================");
  log("      MENU ITEM IMAGE PIPELINE AUDIT REPORT       ");
  log("==================================================\n");

  const content = fs.readFileSync(MENU_FILE_PATH, "utf8");
  const jsContent = content
    .replace(/export interface [\s\S]*?\n}/g, "")
    .replace(/: MenuCategory\[]/g, "")
    .replace(/: MenuItem\[]/g, "")
    .replace(/\bexport\s+/g, "");

  let MENU_ITEMS = [];
  try {
    const evalFn = new Function("exports", jsContent + "\nreturn { MENU_ITEMS };");
    const result = evalFn({});
    MENU_ITEMS = result.MENU_ITEMS;
  } catch (err) {
    console.error("Error evaluating menu.ts:", err);
    process.exit(1);
  }

  const diskFiles = getAllFiles(PUBLIC_FOOD_DIR);
  const diskRelativePaths = diskFiles.map((f) => "/" + path.relative(PUBLIC_DIR, f));
  
  // Maps for checking disk files
  const normalizedDiskMap = new Map();
  const diskFileBasenames = new Map(); // basename lower -> relative path
  const exactDiskSet = new Set(diskRelativePaths);

  diskRelativePaths.forEach((relPath) => {
    const base = path.basename(relPath);
    const norm = normalizeStr(base);
    normalizedDiskMap.set(norm, relPath);
    diskFileBasenames.set(base.toLowerCase(), relPath);
  });

  const auditResults = [];
  const fallingBackItems = [];
  const characterMismatchItems = [];

  log("--- 1. AUDITING ALL MENU ITEMS IN DETAIL ---\n");

  MENU_ITEMS.forEach((item, index) => {
    const expected = item.image || null;
    let actualOnDisk = null;
    let exactExists = false;
    let charMismatchNotes = [];

    if (expected) {
      exactExists = exactDiskSet.has(expected);

      if (exactExists) {
        actualOnDisk = expected;
      } else {
        // Look for character-by-character discrepancies
        const expectedBase = path.basename(expected);

        // Space check
        if (expected.includes("%20") || expected.includes("  ") || expectedBase.startsWith(" ") || expectedBase.endsWith(" ")) {
          charMismatchNotes.push("Space issue: leading/trailing space or %20 encoding in path");
        }

        // Casing / basename lower match
        const matchingBaseLower = diskFileBasenames.get(expectedBase.toLowerCase());
        if (matchingBaseLower && matchingBaseLower !== expected) {
          charMismatchNotes.push(`Casing/Path difference: expected '${expected}' vs disk '${matchingBaseLower}'`);
          actualOnDisk = matchingBaseLower;
        }

        // Extension check (.png vs .jpg vs .jpeg vs .webp)
        const nameNoExt = path.basename(expectedBase, path.extname(expectedBase));
        for (const ext of [".png", ".jpg", ".jpeg", ".webp"]) {
          const altBase = nameNoExt + ext;
          const found = diskFileBasenames.get(altBase.toLowerCase());
          if (found && found !== expected) {
            charMismatchNotes.push(`Extension difference: expected '${path.extname(expectedBase)}' vs disk '${ext}' at '${found}'`);
            if (!actualOnDisk) actualOnDisk = found;
          }
        }

        // Normalized fuzzy match
        const normExpected = normalizeStr(expectedBase);
        if (!actualOnDisk && normalizedDiskMap.has(normExpected)) {
          const foundPath = normalizedDiskMap.get(normExpected);
          charMismatchNotes.push(`Name/Space/Hyphen difference: expected '${expected}' vs disk '${foundPath}'`);
          actualOnDisk = foundPath;
        }
      }
    } else {
      // item.image is undefined
      const normName = normalizeStr(item.name);
      const normSlug = normalizeStr(item.slug);

      if (normalizedDiskMap.has(normName)) {
        actualOnDisk = normalizedDiskMap.get(normName);
        charMismatchNotes.push(`Image exists on disk at '${actualOnDisk}', but item.image is undefined in menu.ts`);
      } else if (normalizedDiskMap.has(normSlug)) {
        actualOnDisk = normalizedDiskMap.get(normSlug);
        charMismatchNotes.push(`Image exists on disk at '${actualOnDisk}', but item.image is undefined in menu.ts`);
      }
    }

    const itemStatus = {
      index: index + 1,
      id: item.id,
      name: item.name,
      category: item.category,
      expectedImagePath: expected || "(undefined)",
      actualImagePath: actualOnDisk || "(none on disk)",
      exactFileExists: exactExists,
      charMismatchNotes,
    };

    auditResults.push(itemStatus);

    if (charMismatchNotes.length > 0) {
      characterMismatchItems.push(itemStatus);
    }

    if (!exactExists) {
      fallingBackItems.push(itemStatus);
    }

    log(`Dish #${index + 1}: ${item.name}`);
    log(`  - ID                 : ${item.id}`);
    log(`  - Category           : ${item.category}`);
    log(`  - Expected Image Path: ${itemStatus.expectedImagePath}`);
    log(`  - Actual Image Path  : ${itemStatus.actualImagePath}`);
    log(`  - File Exists (Exact): ${exactExists ? "YES ✅" : "NO ❌"}`);
    if (charMismatchNotes.length > 0) {
      log(`  - Mismatch Details   : ${charMismatchNotes.join(" | ")}`);
    }
    log("");
  });

  log("==================================================");
  log("--- 2. CHARACTER-BY-CHARACTER MISMATCH SUMMARY ---");
  log("==================================================\n");

  log(`Found ${characterMismatchItems.length} items with path/filename mismatches or missing item.image references:\n`);
  characterMismatchItems.forEach((item) => {
    log(`• [${item.id}] "${item.name}"`);
    log(`  Expected Path: ${item.expectedImagePath}`);
    log(`  Actual Disk  : ${item.actualImagePath}`);
    log(`  Notes        : ${item.charMismatchNotes.join("; ")}\n`);
  });

  log("==================================================");
  log("--- 3. FINAL SUMMARY & FALLBACK REPORT ---");
  log("==================================================\n");

  log(`Total Menu Items Audited : ${auditResults.length}`);
  log(`Items with Exact File    : ${auditResults.length - fallingBackItems.length}`);
  log(`Items Falling Back       : ${fallingBackItems.length}\n`);

  log("--- LIST OF ALL MENU ITEMS THAT STILL FALL BACK ---");
  fallingBackItems.forEach((item, idx) => {
    log(`${idx + 1}. [${item.id}] "${item.name}" (${item.category})`);
    log(`   Expected Path : ${item.expectedImagePath}`);
    log(`   Actual Disk   : ${item.actualImagePath}`);
    log(`   Reason        : ${
      item.expectedImagePath === "(undefined)"
        ? item.actualImagePath !== "(none on disk)"
          ? `File exists at '${item.actualImagePath}', but item.image was missing/undefined in menu.ts.`
          : "No corresponding image file exists on disk, and item.image is undefined."
        : item.charMismatchNotes.length > 0
        ? item.charMismatchNotes.join("; ")
        : "Specified path does not exist on disk."
    }`);
    log("");
  });

  fs.writeFileSync(path.join(SCRATCH_DIR, "full_audit_log.txt"), logLines.join("\n"), "utf8");
  console.log(`Saved full audit log to scratch/full_audit_log.txt`);
}

runAudit();
