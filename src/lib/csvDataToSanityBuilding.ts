import { GeopointValue } from "sanity";
import { categories } from "./categories";
import { states } from "./states";

const clean = (str: string) => (str ? str.toLowerCase().trim() : "");
const parseCategory = (str: string) =>
  categories.find((cat) => cat.value === clean(str))?.value ?? "övrig";

const parseState = (str: string) =>
  states.find((state) => state.value === clean(str))?.value ?? "";

const fieldMapping2: Record<string, keyof CsvRow> = {
  category: "KATEGORI",
  state: "STATUS",
  name: "BYGGNADENS NAMN",
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
  description: "ÖVRIGT/BERÄTTELSE",
  demolitionCause: "BAKGRUND TILL RIVNING (KÄLLA)",
};

export interface CsvRow {
  POSITION: string;
  LAT: string;
  LONG: string;
  BILD: string;
  "BILD UPPHOVSRÄTT ": string;
  STATUS: string;
  "BYGGNADENS NAMN": string;
  GATUADRESS: string;
  POSTNR: string;
  POSTORT: string;
  KVARTERSNAMN: string;
  FASTIGHETSBETECKNING: string;
  ARKITEKT: string;
  FASTIGHETSÄGARE: string;
  "STORLEK (m2)": string;
  BYGGÅR: string;
  RIVNINGSÅR: string;
  "ÖVRIGT/BERÄTTELSE": string;
  "BAKGRUND TILL RIVNING (KÄLLA)": string;
  KATEGORI: string;
}

export const csvDataToSanityBuilding = (src: CsvRow) => {
  if (!src.LAT || !src.LONG) return undefined;
  const location: GeopointValue = {
    _type: "geopoint",
    lat: Number(src.LAT.replace(",", ".")),
    lng: Number(src.LONG.replace(",", ".")),
  };
  const dest: Omit<SanityBuilding<GeopointValue>, "_id" | "images"> & {
    _type: "building";
    images?: {
      _type: string;
      asset: {
        _type: string;
        _ref: string;
      };
    }[];
  } = {
    _type: "building",
    location,
    category: parseCategory(src[fieldMapping2.category]),
    state: parseState(src[fieldMapping2.state]),
    name: src[fieldMapping2.name],
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
