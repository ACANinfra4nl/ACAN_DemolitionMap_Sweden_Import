import {
  getCountryWriteToken,
  resolveImportCountry,
} from "./importCountry";

describe("importCountry", () => {
  const keys = [
    "LANGUAGE",
    "SANITY_AUTH_TOKEN",
    "SANITY_AUTH_TOKEN_NL",
    "SANITY_AUTH_TOKEN_AU",
    "SANITY_AUTH_TOKEN_DK",
  ] as const;
  const original: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const key of keys) {
      original[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of keys) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  });

  it("uses an explicit country over LANGUAGE", () => {
    process.env.LANGUAGE = "nl";
    expect(resolveImportCountry("au")).toBe("au");
    expect(resolveImportCountry("dk")).toBe("dk");
  });

  it("falls back to LANGUAGE when no country is given", () => {
    process.env.LANGUAGE = "au";
    expect(resolveImportCountry()).toBe("au");
  });

  it("uses SANITY_AUTH_TOKEN_AU for Australia even when LANGUAGE is nl", () => {
    process.env.LANGUAGE = "nl";
    process.env.SANITY_AUTH_TOKEN = "nl-token";
    process.env.SANITY_AUTH_TOKEN_AU = "au-token";
    expect(getCountryWriteToken("au")).toBe("au-token");
    expect(getCountryWriteToken("nl")).toBe("nl-token");
    expect(getCountryWriteToken("dk")).toBeUndefined();
  });
});
