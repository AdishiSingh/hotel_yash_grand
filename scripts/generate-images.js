/* eslint-disable */
const fs = require("fs");
const path = require("path");
const https = require("https");

const MENU_FILE_PATH = path.join(__dirname, "../src/data/menu.ts");
const PROMPTS_FILE_PATH = path.join(__dirname, "../src/data/food-image-prompts.json");
const PUBLIC_FOOD_DIR = path.join(__dirname, "../public/assets/food");

const CATEGORY_MAP = {
  "Soup": "soup",
  "Salad & Papad": "salad-papad",
  "Starter (Chinese)": "starter-chinese",
  "Rice & Noodles": "rice-noodles",
  "Main Course": "main-course",
  "Dal": "dal",
  "Rice & Biryani": "rice-biryani",
  "Tandoori Bread": "tandoori-bread",
  "Tandoor Starter": "tandoor-starter",
  "South Indian": "south-indian",
  "Beverages": "beverages",
  "Momos": "momos",
  "Sandwiches": "sandwiches",
  "Pizza": "pizza",
  "Combos": "combos",
  "Sweets & Desserts": "sweets-desserts",
  "Thalis": "thalis"
};

// ANSI color escapes for beautiful terminal logging
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  red: "\x1b[31m"
};

function log(message, type = "info") {
  const timestamp = new Date().toLocaleTimeString();
  let color = colors.reset;
  let prefix = "[INFO]";

  switch (type) {
    case "success":
      color = colors.green;
      prefix = "[SUCCESS]";
      break;
    case "warn":
      color = colors.yellow;
      prefix = "[WARN]";
      break;
    case "error":
      color = colors.red;
      prefix = "[ERROR]";
      break;
    case "accent":
      color = colors.cyan;
      prefix = "[PIPELINE]";
      break;
  }

  console.log(`${colors.bright}${color}${prefix} (${timestamp})${colors.reset} ${message}`);
}

// Promisified HTTPS request for Gemini API (Gemini 3.1 Flash Image model)
function generateImageFromGemini(prompt, apiKey) {
  return new Promise((resolve, reject) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${apiKey}`;
    
    const postData = JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Generate a high-quality, professional food photography image of: ${prompt}`
            }
          ]
        }
      ],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"]
      }
    });

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData)
      }
    };

    const req = https.request(url, options, (res) => {
      let responseBody = "";

      res.on("data", (chunk) => {
        responseBody += chunk;
      });

      res.on("end", () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`API Error (Status ${res.statusCode}): ${responseBody}`));
        }

        try {
          const parsed = JSON.parse(responseBody);
          let base64Data = null;
          
          if (parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content && parsed.candidates[0].content.parts) {
            for (const part of parsed.candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                base64Data = part.inlineData.data;
                break;
              }
            }
          }

          if (base64Data) {
            const buffer = Buffer.from(base64Data, "base64");
            resolve(buffer);
          } else {
            reject(new Error("No generated image data found in response: " + responseBody.substring(0, 500)));
          }
        } catch (e) {
          reject(new Error("Failed to parse API response: " + e.message));
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseMenuItems() {
  if (!fs.existsSync(MENU_FILE_PATH)) {
    log(`Error: Menu file not found at ${MENU_FILE_PATH}`, "error");
    process.exit(1);
  }

  const fileContent = fs.readFileSync(MENU_FILE_PATH, "utf8");
  const lines = fileContent.split(/\r?\n/);
  
  let currentItem = null;
  let inMenuItems = false;
  const items = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect block start for MENU_ITEMS
    if (line.includes("export const MENU_ITEMS")) {
      inMenuItems = true;
    }

    if (!inMenuItems) continue;

    // Detect single item boundary
    if (line.trim() === "{" || line.trim().startsWith("{")) {
      currentItem = {
        id: "",
        name: "",
        slug: "",
        category: "",
        image: ""
      };
    }

    if (currentItem) {
      // Parse properties using regexes
      const idMatch = line.match(/id:\s*["']([^"']+)["']/);
      if (idMatch) currentItem.id = idMatch[1];

      const nameMatch = line.match(/name:\s*["']([^"']+)["']/);
      if (nameMatch) currentItem.name = nameMatch[1];

      const slugMatch = line.match(/slug:\s*["']([^"']+)["']/);
      if (slugMatch) currentItem.slug = slugMatch[1];

      const catMatch = line.match(/category:\s*["']([^"']+)["']/);
      if (catMatch) currentItem.category = catMatch[1];

      const imgMatch = line.match(/image:\s*["']([^"']+)["']/);
      if (imgMatch) currentItem.image = imgMatch[1];

      // Detect single item boundary end
      if (line.trim() === "}," || line.trim() === "}") {
        if (currentItem.id) {
          items.push(currentItem);
        }
        currentItem = null;
      }
    }
  }
  return items;
}

// Concurrency queue runner
async function runConcurrent(tasks, concurrencyLimit, taskExecutor) {
  const results = [];
  const activePromises = [];
  
  for (const task of tasks) {
    const promise = taskExecutor(task).then(res => {
      activePromises.splice(activePromises.indexOf(promise), 1);
      return res;
    });
    
    results.push(promise);
    activePromises.push(promise);
    
    if (activePromises.length >= concurrencyLimit) {
      await Promise.race(activePromises);
    }
  }
  
  return Promise.all(results);
}

async function main() {
  const startTime = Date.now();
  log("Starting fully automated production image generation pipeline...", "accent");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    log("GEMINI_API_KEY environment variable is NOT set. Cannot generate images.", "error");
    process.exit(1);
  }

  if (!fs.existsSync(PROMPTS_FILE_PATH)) {
    log(`Prompts file not found at ${PROMPTS_FILE_PATH}. Please run the pipeline script first: node scripts/automate-menu-pipeline.js`, "error");
    process.exit(1);
  }

  const menuItems = parseMenuItems();
  const prompts = JSON.parse(fs.readFileSync(PROMPTS_FILE_PATH, "utf8"));
  
  const promptMap = new Map();
  for (const p of prompts) {
    promptMap.set(p.id, p);
  }

  log(`Loaded ${menuItems.length} menu items from menu.ts.`, "info");
  log(`Loaded ${prompts.length} prompt mappings from food-image-prompts.json.`, "info");

  let generatedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  
  const concurrencyLimit = 3; // Concurrently generate 3 images at a time to respect rate limits

  const taskExecutor = async (itemWithIndex) => {
    const { item, index } = itemWithIndex;
    const total = menuItems.length;

    // Check if the image already exists on disk
    const relativeImagePath = item.image;
    let exists = false;
    if (relativeImagePath) {
      const existingFilePath = path.join(__dirname, "../public", relativeImagePath);
      if (fs.existsSync(existingFilePath)) {
        exists = true;
      }
    }

    const promptInfo = promptMap.get(item.id);
    const categorySlug = promptInfo 
      ? promptInfo.categorySlug 
      : (CATEGORY_MAP[item.category] || item.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    
    const targetFilePath = path.join(PUBLIC_FOOD_DIR, categorySlug, `${item.slug}.webp`);
    
    if (fs.existsSync(targetFilePath)) {
      exists = true;
    }

    if (exists) {
      skippedCount++;
      return { id: item.id, status: "skipped" };
    }

    if (!promptInfo) {
      log(`[${index}/${total}] Warning: No prompt found for item ID ${item.id} (${item.name}). Skipping.`, "warn");
      failedCount++;
      return { id: item.id, status: "failed", error: "No prompt found" };
    }

    // Ensure directory exists
    const catDir = path.join(PUBLIC_FOOD_DIR, categorySlug);
    if (!fs.existsSync(catDir)) {
      fs.mkdirSync(catDir, { recursive: true });
    }

    log(`[${index}/${total}] Generating ${item.name}...`, "info");

    const maxAttempts = 3;
    let success = false;
    let lastError = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const imageBuffer = await generateImageFromGemini(promptInfo.prompt, apiKey);
        fs.writeFileSync(targetFilePath, imageBuffer);
        log(`✓ Saved ${item.name} to assets/food/${categorySlug}/${item.slug}.webp`, "success");
        success = true;
        generatedCount++;
        break;
      } catch (err) {
        lastError = err;
        log(`[Attempt ${attempt}/${maxAttempts}] Failed to generate image for ${item.name}: ${err.message}`, "warn");
        if (attempt < maxAttempts) {
          // Linear backoff to avoid rate limits
          const delay = attempt * 2000;
          await sleep(delay);
        }
      }
    }

    if (!success) {
      log(`✗ Failed completely: ${item.name}. Error: ${lastError.message}`, "error");
      failedCount++;
      return { id: item.id, status: "failed", error: lastError.message };
    }

    // Adding 1 second delay between tasks inside the same worker stream to be polite to rate limits
    await sleep(1000);

    return { id: item.id, status: "generated" };
  };

  // Build the list of tasks with indices (1-based)
  const tasks = menuItems.map((item, idx) => ({
    item,
    index: idx + 1
  }));

  // Run the concurrent process
  await runConcurrent(tasks, concurrencyLimit, taskExecutor);

  const totalTimeSec = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log("\n==================================================");
  log("IMAGE GENERATION PIPELINE SUMMARY", "accent");
  console.log("==================================================");
  console.log(`Generated: ${generatedCount}`);
  console.log(`Skipped:   ${skippedCount}`);
  console.log(`Failed:    ${failedCount}`);
  console.log(`Total:     ${menuItems.length}`);
  console.log(`Total Time: ${totalTimeSec} seconds`);
  console.log("==================================================\n");
}

main();
