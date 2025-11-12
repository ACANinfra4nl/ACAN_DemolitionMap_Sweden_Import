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

// Set environment variables
Object.keys(envVars).forEach((key) => {
  process.env[key] = envVars[key];
});

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-09-01",
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

async function createDocuments() {
  try {
    // Create manifest document
    console.log("Creating manifest document...");
    const manifest = await client.createOrReplace({
      _id: "manifest",
      _type: "manifest",
      intro: [
        {
          _type: "block",
          style: "normal",
          children: [
            {
              _type: "span",
              text: "Welkom bij de Demolition Atlas NL. Dit is tijdelijke placeholder-tekst.",
            },
          ],
        },
      ],
      content: [
        {
          _type: "block",
          style: "normal",
          children: [
            {
              _type: "span",
              text: "Placeholder content. Je kunt dit later aanpassen in Studio.",
            },
          ],
        },
      ],
    });
    console.log("✓ Manifest created:", manifest._id);

    // Create settings document
    console.log("Creating settings document...");
    const settings = await client.createOrReplace({
      _id: "settings",
      _type: "settings",
      siteTitle: "Demolition Atlas NL",
      feedbackEmail: "info@example.com",
      seo: {
        description: "Demolition Atlas voor Nederland",
      },
      confirmationMessage: {
        heading: "Bedankt!",
        body: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: "We laten het je weten zodra je bijdrage beoordeeld is.",
              },
            ],
          },
        ],
      },
      errorMessage: {
        heading: "Er is iets misgegaan",
        body: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: "Probeer het later opnieuw.",
              },
            ],
          },
        ],
      },
    });
    console.log("✓ Settings created:", settings._id);

    console.log("\n✅ All documents created successfully!");
    console.log("You can now restart your dev server and access Studio at http://localhost:3000/studio");
  } catch (error) {
    console.error("❌ Error creating documents:", error.message);
    if (error.response) {
      console.error("Response:", JSON.stringify(error.response.body, null, 2));
    }
    process.exit(1);
  }
}

createDocuments();

