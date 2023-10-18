import classNames from "classnames";
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
      name: "intro",
      type: "array",
      title: "Ingress",
      of: [
        {
          type: "block",
          styles: [],
          lists: [],
          marks: {
            decorators: [],
          },
        },
      ],
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
            {
              title: "Ingress",
              value: "intro",
              component: ({ children }) => (
                <p className="max-w-[24em] text-xl font-bold">{children}</p>
              ),
            },
          ],
        },
        { type: "image" },
      ],
    },
  ],
};
