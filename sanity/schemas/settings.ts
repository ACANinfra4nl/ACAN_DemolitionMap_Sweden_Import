import { SchemaTypeDefinition } from "sanity";
import { SettingsIcon } from "../components/SettingsIcon";

export const settings: SchemaTypeDefinition = {
  name: "settings",
  type: "document",
  icon: SettingsIcon,
  fields: [
    {
      name: "siteTitle",
      type: "string",
      title: "Site title",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "feedbackEmail",
      type: "email",
      title: "Feedback email",
      description:
        "This email address is linked from the details pane where users can add details and suggest changes",
    },
    {
      name: "confirmationMessage",
      type: "object",
      title: "Confirmation message",
      fields: [
        {
          name: "heading",
          type: "string",
          title: "Heading",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "body",
          type: "array",
          title: "Body",
          of: [{ type: "block" }],
          validation: (Rule) => Rule.required(),
        },
      ],
    },
    {
      name: "errorMessage",
      type: "object",
      title: "Error message",
      fields: [
        {
          name: "heading",
          type: "string",
          title: "Heading",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "body",
          type: "array",
          title: "Body",
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
          title: "Description",
          description:
            "Description of the site for search engines, search results, etc",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "image",
          type: "image",
          title: "Image",
          description: "Image used when the site is shared",
          validation: (Rule) => Rule.required(),
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Settings",
      };
    },
  },
};
