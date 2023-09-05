import { type SchemaTypeDefinition } from "sanity";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    {
      name: "building",
      type: "document",
      title: "Building",
      description: "Building submitted by users, visible on the map",
      fields: [
        {
          name: "location",
          type: "geopoint",
          title: "Location",
          readOnly: true,
          validation: (Rule) => Rule.required(),
        },
        {
          name: "name",
          type: "string",
          title: "Name",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "description",
          type: "text",
          title: "Description",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "state",
          type: "string",
          options: {
            list: ["threatened", "destroyed", "saved"],
            layout: "radio",
          },
        },
      ],
    },
  ],
};
