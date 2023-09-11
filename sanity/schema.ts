import { type SchemaTypeDefinition } from "sanity";
import { building } from "./schemas/building";
import { manifest } from "./schemas/manifest";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [building, manifest],
};
