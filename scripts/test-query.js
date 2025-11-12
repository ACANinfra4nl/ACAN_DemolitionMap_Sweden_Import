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
  token: envVars.SANITY_READ_TOKEN || envVars.SANITY_AUTH_TOKEN,
  useCdn: false,
  perspective: "published",
});

async function testQuery() {
  try {
    // Test the exact query from the app
    const manifestQuery = `*[_type == "manifest" && _id == "manifest"] | order(_updatedAt desc)[0] {
      ...,
    }`;
    
    console.log("Testing manifest query...");
    const result = await client.fetch(manifestQuery);
    
    if (result) {
      console.log("✓ Query returned result");
      console.log("  _id:", result._id);
      console.log("  _type:", result._type);
      console.log("  has intro:", !!result.intro);
      console.log("  has content:", !!result.content);
    } else {
      console.log("❌ Query returned null!");
      console.log("\nTrying without order clause...");
      const simpleQuery = `*[_type == "manifest" && _id == "manifest"][0]`;
      const simpleResult = await client.fetch(simpleQuery);
      if (simpleResult) {
        console.log("✓ Simple query works!");
        console.log("  The issue is with the order clause");
      } else {
        console.log("❌ Simple query also returns null");
      }
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testQuery();

