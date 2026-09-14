import { getSettingsLogoUrl } from "./countryLogo";

const uploaded = {
  logo: { asset: { url: " https://cdn.sanity.io/files/x/y/logo.svg " } },
};

describe("getSettingsLogoUrl", () => {
  it("returns the uploaded SVG for Australia and Denmark", () => {
    expect(getSettingsLogoUrl(uploaded, "au")).toBe(
      "https://cdn.sanity.io/files/x/y/logo.svg",
    );
    expect(getSettingsLogoUrl(uploaded, "dk")).toBe(
      "https://cdn.sanity.io/files/x/y/logo.svg",
    );
  });

  it("ignores Studio uploads for the Netherlands", () => {
    expect(getSettingsLogoUrl(uploaded, "nl")).toBeUndefined();
  });

  it("falls back when no file is uploaded", () => {
    expect(getSettingsLogoUrl({}, "au")).toBeUndefined();
    expect(getSettingsLogoUrl(null, "dk")).toBeUndefined();
  });
});
