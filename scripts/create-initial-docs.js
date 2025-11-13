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
    const language = process.env.LANGUAGE || "en";
    const isAU = language === "au";
    const isDK = language === "dk";

    // Create manifest document
    console.log("Creating manifest document...");
    let manifestIntro, manifestContent;
    if (isAU) {
      manifestIntro = "Welcome to the Demolition Atlas AU. This is temporary placeholder text.";
      manifestContent = "Placeholder content. You can edit this later in Studio.";
    } else if (isDK) {
      manifestIntro = "Velkommen til Rivningskort DK. Dette er midlertidig placeholder-tekst.";
      manifestContent = "Placeholder-indhold. Du kan redigere dette senere i Studio.";
    } else {
      manifestIntro = "Welkom bij de Demolition Atlas NL. Dit is tijdelijke placeholder-tekst.";
      manifestContent = "Placeholder content. Je kunt dit later aanpassen in Studio.";
    }

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
              text: manifestIntro,
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
              text: manifestContent,
            },
          ],
        },
      ],
    });
    console.log("✓ Manifest created:", manifest._id);

    // Create settings document
    console.log("Creating settings document...");
    let siteTitle, seoDescription, confirmationHeading, confirmationBody, errorHeading, errorBody;
    if (isAU) {
      siteTitle = "Demolition Atlas AU";
      seoDescription = "Demolition Atlas for Australia";
      confirmationHeading = "Thank you!";
      confirmationBody = "We will let you know once your contribution has been reviewed.";
      errorHeading = "Something went wrong";
      errorBody = "Please try again later.";
    } else if (isDK) {
      siteTitle = "Rivningskort DK";
      seoDescription = "Rivningskort for Danmark";
      confirmationHeading = "Tak!";
      confirmationBody = "Vi giver dig besked, når dit bidrag er gennemgået.";
      errorHeading = "Noget gik galt";
      errorBody = "Prøv venligst igen senere.";
    } else {
      siteTitle = "Demolition Atlas NL";
      seoDescription = "Demolition Atlas voor Nederland";
      confirmationHeading = "Bedankt!";
      confirmationBody = "We laten het je weten zodra je bijdrage beoordeeld is.";
      errorHeading = "Er is iets misgegaan";
      errorBody = "Probeer het later opnieuw.";
    }

    const settings = await client.createOrReplace({
      _id: "settings",
      _type: "settings",
      siteTitle: siteTitle,
      feedbackEmail: "info@example.com",
      seo: {
        description: seoDescription,
      },
      confirmationMessage: {
        heading: confirmationHeading,
        body: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: confirmationBody,
              },
            ],
          },
        ],
      },
      errorMessage: {
        heading: errorHeading,
        body: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: errorBody,
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

