import { GeopointValue } from "sanity";
import { csvDataToSanityBuilding } from "./csvDataToSanityBuilding";

it("should convert data from csv file to sanity building", () => {
  const csvData = {
    NAMN: "",
    BILD: "",
    KATEGORI: "Kontor",
    STATUS: "Riven",
    FASTIGHETSBETECKNING: "Marievik 15",
    BYGGÅR: "1980",
    RIVNINGSÅR: "2023",
    GATUADRESS: "",
    POSTNR: "",
    POSTORT: "Stockholm",
    KVARTERSNAMN: "",
    POSITION:
      "SWEREF 99 TM\nN 6578672, E 672524\nWGS84\n59°18'41.7\"N 18°1'51.6\"E",
    LAT: "59,311583",
    LONG: "18,031",
    "STORLEK (m2)": "",
    ARKITEKT: "Anders Berg och Erik Thelaus",
    FASTIGHETSÄGARE: "",
    ARKITEKTUR: "",
    RIVNINGSORSAK: "",
    "ÖVRIGT/BERÄTTELSE": "",
  };

  const result = csvDataToSanityBuilding(csvData);

  expect(result).toEqual({
    _type: "building",
    location: {
      _type: "geopoint",
      lat: 59.311583,
      lng: 18.031,
    },
    category: "kontor",
    state: "riven",
    propertyDesignation: "Marievik 15",
    buildYear: 1980,
    demolitionYear: 2023,
    city: "Stockholm",
    architect: "Anders Berg och Erik Thelaus",
    address: "",
    blockName: "",
    demolitionCause: "",
    description: "",
    postcode: "",
    propertyOwner: "",
    size: 0,
  });
});
