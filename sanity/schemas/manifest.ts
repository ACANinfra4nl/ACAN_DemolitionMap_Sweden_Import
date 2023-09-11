import { SchemaTypeDefinition } from "sanity";

export const manifest: SchemaTypeDefinition = {
  name: "manifest",
  type: "document",
  title: "Manifest",
  description: "Innehåll för manifestsidan",
  fields: [
    {
      name: "heading",
      type: "string",
      title: "Rubrik",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "content",
      type: "array",
      title: "Innehåll",
      of: [{ type: "block" }, { type: "image" }],
    },
  ],
};
