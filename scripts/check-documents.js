const { createClient } = require("@sanity/client");
const fs = require("fs");
const path = require("path");

// Read .env.local file
const envPath = path.join(__dirname, "..", ".env.local");
const envFile = fs.readFileSync(envPath, "utf8");
const envVars = {};
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    envVars[key] = value;
  }
});

const client = createClient({
  projectId: envVars.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: envVars.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: envVars.NEXT_PUBLIC_SANITY_API_VERSION || "2023-09-01",
  token: envVars.SANITY_AUTH_TOKEN,
  useCdn: false,
});

async function checkDocuments() {
  try {
    console.log("Checking for documents...");
    console.log("Project ID:", envVars.NEXT_PUBLIC_SANITY_PROJECT_ID);
    console.log("Dataset:", envVars.NEXT_PUBLIC_SANITY_DATASET);
    
    const docs = await client.fetch('*[_type == "manifest" || _type == "settings"]');
    console.log("\nFound documents:", docs.length);
    docs.forEach((d) => console.log("  -", d._id, d._type));
    
    if (docs.length === 0) {
      console.log("\n❌ No documents found! They need to be created.");
      return false;
    }
    
    // Check if manifest exists
    const manifest = docs.find((d) => d._id === "manifest");
    const settings = docs.find((d) => d._id === "settings");
    
    if (!manifest) {
      console.log("\n❌ Manifest document not found!");
    } else {
      console.log("\n✓ Manifest document exists");
    }
    
    if (!settings) {
      console.log("❌ Settings document not found!");
    } else {
      console.log("✓ Settings document exists");
    }
    
    return manifest && settings;
  } catch (error) {
    console.error("❌ Error checking documents:", error.message);
    if (error.response) {
      console.error("Response:", JSON.stringify(error.response.body, null, 2));
    }
    return false;
  }
}

checkDocuments().then((exists) => {
  if (!exists) {
    console.log("\nRun: node scripts/create-initial-docs.js");
    process.exit(1);
  } else {
    console.log("\n✅ All required documents exist!");
    process.exit(0);
  }
});

