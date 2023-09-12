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
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
        },
        { type: "image" },
      ],
    },
  ],
};
