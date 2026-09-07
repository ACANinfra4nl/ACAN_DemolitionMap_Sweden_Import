/**
 * List published buildings whose coordinates sit outside the active country outline.
 *
 * Uses LANGUAGE / Sanity project from .env.local (override with env vars).
 * Example:
 *   LANGUAGE=au NEXT_PUBLIC_SANITY_PROJECT_ID=yps8kvw9 node scripts/list-out-of-country-buildings.js
 */
const { createClient } = require("@sanity/client");
const fs = require("fs");
const path = require("path");
const { resolveSanityProjectId } = require("./countrySanity");

const envPath = path.join(__dirname, "..", ".env.local");
const envVars = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (!match) return;
      const key = match[1].trim();
      let value = match[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      envVars[key] = value;
    });
}

const language = (process.env.LANGUAGE || envVars.LANGUAGE || "")
  .toLowerCase()
  .trim();
if (!["nl", "au", "dk"].includes(language)) {
  throw new Error(
    `Set LANGUAGE to nl, au, or dk (got "${language || ""}")`,
  );
}

const outlines = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "src", "data", "countryPolygons.json"),
    "utf8",
  ),
);

const pointInRing = (lng, lat, ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const crosses =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
};

const isPointInCountry = (lat, lng, country) => {
  const outline = outlines[country];
  if (!outline) return false;
  const pad = 0.02;
  const [minLng, minLat, maxLng, maxLat] = outline.bbox;
  if (
    lng < minLng - pad ||
    lng > maxLng + pad ||
    lat < minLat - pad ||
    lat > maxLat + pad
  ) {
    return false;
  }
  return outline.polygons.some((polygon) => {
    const [outer, ...holes] = polygon;
    if (!outer || !pointInRing(lng, lat, outer)) return false;
    return !holes.some((hole) => pointInRing(lng, lat, hole));
  });
};

const mergedEnv = { ...envVars, LANGUAGE: language };
if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  mergedEnv.NEXT_PUBLIC_SANITY_PROJECT_ID =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
}

const client = createClient({
  projectId: resolveSanityProjectId(mergedEnv),
  dataset: mergedEnv.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: mergedEnv.NEXT_PUBLIC_SANITY_API_VERSION || "2023-09-01",
  token: mergedEnv.SANITY_READ_TOKEN || mergedEnv.SANITY_AUTH_TOKEN,
  useCdn: false,
});

const run = async () => {
  const buildings = await client.fetch(
    `*[_type == "building" && defined(location.lat) && defined(location.lng)]{
      _id, name, address, city, location
    }`,
  );
  const outside = buildings.filter(
    (building) =>
      !isPointInCountry(building.location.lat, building.location.lng, language),
  );
  console.log(
    `${language.toUpperCase()} ${buildings.length} buildings, ${outside.length} outside the country outline`,
  );
  for (const building of outside) {
    console.log(
      [
        building._id,
        building.name || "(unnamed)",
        building.address || "",
        building.city || "",
        `${building.location.lat},${building.location.lng}`,
      ].join(" | "),
    );
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
