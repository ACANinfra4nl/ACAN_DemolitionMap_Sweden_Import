import { SchemaTypeDefinition } from "sanity";
import { SettingsIcon } from "../components/SettingsIcon";
import { countryUsesStudioLogo } from "../../src/lib/countrySanity";

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
      name: "logo",
      type: "file",
      title: "Logo (SVG)",
      description:
        "Country logo shown in the header and on the about page. Upload an .svg file. The Netherlands still uses the built-in logo.",
      hidden: () => !countryUsesStudioLogo(),
      options: {
        accept: "image/svg+xml,.svg",
      },
      validation: (Rule) =>
        Rule.custom((value) => {
          const ref = (value as { asset?: { _ref?: string } } | undefined)
            ?.asset?._ref;
          if (!ref) return true;
          if (/-svg($|-)/i.test(ref) || ref.toLowerCase().endsWith("-svg")) {
            return true;
          }
          return "Please upload an SVG file (.svg)";
        }),
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
