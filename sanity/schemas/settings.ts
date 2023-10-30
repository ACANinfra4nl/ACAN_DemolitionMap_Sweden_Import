import { SchemaTypeDefinition } from "sanity";
import { SettingsIcon } from "../components/SettingsIcon";

export const settings: SchemaTypeDefinition = {
  name: "settings",
  type: "document",
  icon: SettingsIcon,
  fields: [
    {
      name: "confirmationMessage",
      type: "object",
      title: "Bekräftelse",
      fields: [
        {
          name: "heading",
          type: "string",
          title: "Rubrik",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "body",
          type: "array",
          title: "Brödtext",
          of: [{ type: "block" }],
          validation: (Rule) => Rule.required(),
        },
      ],
    },
    {
      name: "errorMessage",
      type: "object",
      title: "Felmeddelande",
      fields: [
        {
          name: "heading",
          type: "string",
          title: "Rubrik",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "body",
          type: "array",
          title: "Brödtext",
          of: [{ type: "block" }],
          validation: (Rule) => Rule.required(),
        },
      ],
    },
    {
      name: "seo",
      type: "object",
      title: "SEO",
      fields: [
        {
          name: "description",
          type: "text",
          title: "Beskrivning",
          description: "Beskrivning av sajten för sökmotorer, sökresultat osv.",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "image",
          type: "image",
          title: "Bild",
          description: "Bild som används när sajten delas",
          validation: (Rule) => Rule.required(),
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Inställningar",
      };
    },
  },
};
