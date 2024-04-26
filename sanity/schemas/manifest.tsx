import classNames from "classnames";
import { SchemaTypeDefinition } from "sanity";

export const manifest: SchemaTypeDefinition = {
  name: "manifest",
  type: "document",
  title: "Manifest",
  description: "Content for manifest page",
  fields: [
    {
      name: "heading",
      type: "string",
      title: "Heading",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "intro",
      type: "array",
      title: "Intro",
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
      title: "Content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
            {
              title: "Intro",
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
