const COUNTRY_SANITY_PROJECT_IDS = {
  nl: "q9jkymv5",
  au: "yps8kvw9",
  dk: "obfbyt9x",
};

function resolveSanityProjectId(envVars) {
  const fromEnv = (envVars.NEXT_PUBLIC_SANITY_PROJECT_ID || "").trim();
  if (fromEnv && fromEnv !== "YOUR-PROJECT-ID") {
    return fromEnv;
  }
  const locale = (envVars.LANGUAGE || "").toLowerCase().trim();
  const mapped = COUNTRY_SANITY_PROJECT_IDS[locale];
  if (!mapped) {
    throw new Error(
      `Missing NEXT_PUBLIC_SANITY_PROJECT_ID and no mapping for LANGUAGE="${envVars.LANGUAGE || ""}"`,
    );
  }
  return mapped;
}

module.exports = {
  COUNTRY_SANITY_PROJECT_IDS,
  resolveSanityProjectId,
};
