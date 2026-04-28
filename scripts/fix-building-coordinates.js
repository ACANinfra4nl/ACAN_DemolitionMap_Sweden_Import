const { createClient } = require("@sanity/client");
const fs = require("fs");
const path = require("path");

const NL_BOUNDS = {
  latMin: 50,
  latMax: 54,
  lngMin: 3,
  lngMax: 8,
};

const isLikelyNlPoint = (lat, lng) =>
  lat >= NL_BOUNDS.latMin &&
  lat <= NL_BOUNDS.latMax &&
  lng >= NL_BOUNDS.lngMin &&
  lng <= NL_BOUNDS.lngMax;

const rescueLikelyNlCoordinates = (lat, lng) => {
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  if (isLikelyNlPoint(lat, lng)) return { lat, lng, reason: "already-valid" };

  const scales = [1, 10, 100];
  const candidates = [];

  for (const latScale of scales) {
    for (const lngScale of scales) {
      const candidateLat = lat * latScale;
      const candidateLng = lng * lngScale;
      if (isLikelyNlPoint(candidateLat, candidateLng)) {
        candidates.push({
          lat: candidateLat,
          lng: candidateLng,
          score:
            Math.abs(Math.log10(latScale)) + Math.abs(Math.log10(lngScale)),
          reason: `scaled lat*${latScale}, lng*${lngScale}`,
        });
      }

      const swappedLat = lng * latScale;
      const swappedLng = lat * lngScale;
      if (isLikelyNlPoint(swappedLat, swappedLng)) {
        candidates.push({
          lat: swappedLat,
          lng: swappedLng,
          score:
            0.5 + Math.abs(Math.log10(latScale)) + Math.abs(Math.log10(lngScale)),
          reason: `swapped + scaled lat*${latScale}, lng*${lngScale}`,
        });
      }
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a.score - b.score);
  return candidates[0];
};

const envPath = path.join(__dirname, "..", ".env.local");
const envFile = fs.readFileSync(envPath, "utf8");
const envVars = {};
for (const raw of envFile.split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith("#") || !line.includes("=")) continue;
  const i = line.indexOf("=");
  const key = line.slice(0, i).trim();
  let value = line.slice(i + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  envVars[key] = value;
}

async function run() {
  const client = createClient({
    projectId: envVars.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: envVars.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: envVars.NEXT_PUBLIC_SANITY_API_VERSION || "2023-09-01",
    token: envVars.SANITY_AUTH_TOKEN,
    useCdn: false,
  });
  const shouldApply = process.argv.includes("--apply");
  console.log(shouldApply ? "Running in APPLY mode" : "Running in DRY-RUN mode");

  const docs = await client.fetch(
    '*[_type=="building" && defined(location.lat) && defined(location.lng)]{_id,name,address,location}',
  );

  const fixes = [];
  for (const doc of docs) {
    const lat = doc.location?.lat;
    const lng = doc.location?.lng;
    const rescue = rescueLikelyNlCoordinates(lat, lng);
    if (!rescue) continue;
    if (rescue.reason === "already-valid") continue;

    fixes.push({
      _id: doc._id,
      name: doc.name || doc.address || "(unnamed)",
      from: { lat, lng },
      to: { lat: rescue.lat, lng: rescue.lng },
      reason: rescue.reason,
    });
  }

  if (fixes.length === 0) {
    console.log("No coordinate fixes needed.");
    return;
  }

  console.log(`Found ${fixes.length} coordinates to fix:\n`);
  for (const fix of fixes) {
    console.log(
      `${fix._id} | ${fix.name}\n  ${fix.from.lat}, ${fix.from.lng} -> ${fix.to.lat}, ${fix.to.lng}\n  ${fix.reason}`,
    );
  }

  if (!shouldApply) {
    console.log("\nDry-run only. Re-run with --apply to patch these documents.");
    return;
  }

  for (const fix of fixes) {
    await client
      .patch(fix._id)
      .set({ location: { _type: "geopoint", lat: fix.to.lat, lng: fix.to.lng } })
      .commit();
    console.log(`Patched ${fix._id}`);
  }
  console.log(`\nApplied ${fixes.length} coordinate fixes.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
