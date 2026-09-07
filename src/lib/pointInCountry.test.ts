import { isPointInCountry } from "./pointInCountry";

const amsterdam = { lat: 52.3676, lng: 4.9041 };
const antwerp = { lat: 51.2194, lng: 4.4025 };
const copenhagen = { lat: 55.6761, lng: 12.5683 };
const malmo = { lat: 55.605, lng: 13.0007 };
const sydney = { lat: -33.8688, lng: 151.2093 };
const auckland = { lat: -36.8485, lng: 174.7633 };

describe("isPointInCountry", () => {
  it("accepts major cities in the Netherlands", () => {
    expect(isPointInCountry(amsterdam.lat, amsterdam.lng, "nl")).toBe(true);
    expect(isPointInCountry(50.8514, 5.6909, "nl")).toBe(true); // Maastricht
    expect(isPointInCountry(53.2194, 6.5665, "nl")).toBe(true); // Groningen
  });

  it("rejects points just outside the Netherlands", () => {
    expect(isPointInCountry(antwerp.lat, antwerp.lng, "nl")).toBe(false);
    expect(isPointInCountry(50.7753, 6.0839, "nl")).toBe(false); // Aachen
    expect(isPointInCountry(54.0, 3.5, "nl")).toBe(false); // North Sea
  });

  it("accepts major cities in Denmark including Bornholm", () => {
    expect(isPointInCountry(copenhagen.lat, copenhagen.lng, "dk")).toBe(true);
    expect(isPointInCountry(56.1629, 10.2039, "dk")).toBe(true); // Aarhus
    expect(isPointInCountry(55.1333, 14.9167, "dk")).toBe(true); // Bornholm
  });

  it("rejects points just outside Denmark", () => {
    expect(isPointInCountry(malmo.lat, malmo.lng, "dk")).toBe(false);
    expect(isPointInCountry(53.5511, 9.9937, "dk")).toBe(false); // Hamburg
  });

  it("accepts major cities in Australia including Hobart", () => {
    expect(isPointInCountry(sydney.lat, sydney.lng, "au")).toBe(true);
    expect(isPointInCountry(-31.9505, 115.8605, "au")).toBe(true); // Perth
    expect(isPointInCountry(-42.8821, 147.3272, "au")).toBe(true); // Hobart
    expect(isPointInCountry(-12.4634, 130.8456, "au")).toBe(true); // Darwin
  });

  it("rejects points outside Australia", () => {
    expect(isPointInCountry(auckland.lat, auckland.lng, "au")).toBe(false);
    expect(isPointInCountry(-6.2088, 106.8456, "au")).toBe(false); // Jakarta
  });
});

describe("questionnaire stays closed outside the home country", () => {
  const wouldOpenForm = (
    latLng: LatLng,
    country: "nl" | "au" | "dk",
  ) => isPointInCountry(latLng.lat, latLng.lng, country);

  it("opens only for a click inside the home country", () => {
    expect(wouldOpenForm(copenhagen, "dk")).toBe(true);
    expect(wouldOpenForm(amsterdam, "nl")).toBe(true);
    expect(wouldOpenForm(sydney, "au")).toBe(true);
  });

  it("does not open for a neighbouring city", () => {
    expect(wouldOpenForm(malmo, "dk")).toBe(false);
    expect(wouldOpenForm(antwerp, "nl")).toBe(false);
    expect(wouldOpenForm(auckland, "au")).toBe(false);
  });

  it("does not open when the click is in another overlay country", () => {
    expect(wouldOpenForm(sydney, "dk")).toBe(false);
    expect(wouldOpenForm(copenhagen, "au")).toBe(false);
    expect(wouldOpenForm(amsterdam, "au")).toBe(false);
  });

  it("does not open for ocean clicks", () => {
    expect(wouldOpenForm({ lat: 54.0, lng: 3.5 }, "nl")).toBe(false);
    expect(wouldOpenForm({ lat: 56.5, lng: 5.0 }, "dk")).toBe(false);
  });
});
