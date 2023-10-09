// Fields:
// ------
// "NAMN",
// "BILD",
// "KATEGORI",
// "STATUS",
// "FASTIGHETSBETECKNING",
// "BYGGÅR",
// "RIVNINGSÅR",
// "GATUADRESS",
// "POSTNR",
// "POSTORT",
// "KVARTERSNAMN",
// "POSITION",
// "LAT",
// "LONG",
// "STORLEK (m2)",
// "ARKITEKT",
// "FASTIGHETSÄGARE",
// "ARKITEKTUR",
// "RIVNINGSORSAK",
// "ÖVRIGT/BERÄTTELSE"

import { GeopointValue } from "sanity";
import { categories } from "./categories";
import { states } from "./states";

const clean = (str: string) => (str ? str.toLowerCase().trim() : "");
const parseCategory = (str: string) =>
  categories.find((cat) => cat === clean(str)) ?? "övrig";
const parseState = (str: string) =>
  states.find((state) => state === clean(str)) ?? "";

const fieldMapping2 = {
  category: "KATEGORI",
  state: "STATUS",
  propertyDesignation: "FASTIGHETSBETECKNING",
  buildYear: "BYGGÅR",
  demolitionYear: "RIVNINGSÅR",
  address: "GATUADRESS",
  postcode: "POSTNR",
  city: "POSTORT",
  blockName: "KVARTERSNAMN",
  size: "STORLEK (m2)",
  architect: "ARKITEKT",
  propertyOwner: "FASTIGHETSÄGARE",
  description: "ARKITEKTUR",
  demolitionCause: "RIVNINGSORSAK",
};
const fieldMapping: Record<
  string,
  string | [string, (str: string) => unknown]
> = {
  //   NAMN: undefined,
  //   BILD: undefined,
  KATEGORI: ["category", clean],
  STATUS: [
    "state",
    (str: string) =>
      ["hotad", "riven", "räddad"].includes(
        clean(str).replace("rivet", "riven"),
      )
        ? clean(str)
        : undefined,
  ],
  FASTIGHETSBETECKNING: "propertyDesignation",
  BYGGÅR: ["buildYear", Number],
  RIVNINGSÅR: ["demolitionYear", Number],
  GATUADRESS: "address",
  POSTNR: "postCode",
  POSTORT: "city",
  KVARTERSNAMN: "blockName",
  //   POSITION: undefined,
  //   LAT: undefined,
  //   LONG: undefined,
  "STORLEK (m2)": ["size", Number],
  ARKITEKT: "architect",
  FASTIGHETSÄGARE: "propertyOwner",
  ARKITEKTUR: "description",
  RIVNINGSORSAK: "demolitionCause",
  //   "ÖVRIGT/BERÄTTELSE": undefined,
};
type FieldMapKeyType = keyof typeof fieldMapping;

export const csvDataToSanityBuilding = (src: Record<string, string>) => {
  if (!src.LAT || !src.LONG) return undefined;
  const location: GeopointValue = {
    _type: "geopoint",
    lat: Number(src.LAT.replace(",", ".")),
    lng: Number(src.LONG.replace(",", ".")),
  };
  const dest: Omit<SanityBuilding<GeopointValue>, "_id"> & {
    _type: "building";
  } = {
    _type: "building",
    location,
    category: parseCategory(src[fieldMapping2.category]),
    state: parseState(src[fieldMapping2.state]),
    propertyDesignation: src[fieldMapping2.propertyDesignation],
    buildYear: Number(src[fieldMapping2.buildYear]),
    demolitionYear: Number(src[fieldMapping2.demolitionYear]),
    address: src[fieldMapping2.address],
    postcode: src[fieldMapping2.postcode],
    city: src[fieldMapping2.city],
    blockName: src[fieldMapping2.blockName],
    size: Number(src[fieldMapping2.size]),
    architect: src[fieldMapping2.architect],
    propertyOwner: src[fieldMapping2.propertyOwner],
    description: src[fieldMapping2.description],
    demolitionCause: src[fieldMapping2.demolitionCause],
  };
  return dest;
};
