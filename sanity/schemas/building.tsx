import { SchemaTypeDefinition } from "sanity";
import { MapInput } from "../components/MapInput";
import { categories } from "@/lib/categories";
import { states } from "@/lib/states";
import { emailValidator } from "../lib/validation";

export const building: SchemaTypeDefinition = {
  name: "building",
  type: "document",
  title: "Building",
  description: "Demolition reported by user",
  // Ensure all core actions stay available in Studio for building docs.
  // This includes delete, which some Studio setups can otherwise hide.
  __experimental_actions: ["create", "update", "delete", "publish"],
  fields: [
    {
      name: "reviewed",
      type: "boolean",
      title: "Reviewed",
      description:
        "The reviewed buildings are displayed on the map and in the list on the website.",
      initialValue: false,
    },
    {
      name: "location",
      type: "geopoint",
      title: "Location",
      validation: (Rule) => Rule.required(),
      components: {
        input: MapInput,
      },
    },
    {
      name: "category",
      type: "string",
      title: "Category",
      options: {
        list: categories,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "state",
      type: "string",
      title: "State",
      options: {
        list: states,
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    },
    { name: "name", type: "string", title: "The name of the building" },
    {
      name: "address",
      type: "string",
      title: "Address",
    },
    {
      name: "postcode",
      type: "string",
      title: "Postal code",
    },
    {
      name: "city",
      type: "string",
      title: "City",
    },
    {
      name: "blockName",
      type: "string",
      title: "Block name",
    },
    {
      name: "propertyDesignation",
      type: "string",
      title: "Property designation",
    },
    {
      name: "size",
      type: "number",
      title: "Size",
      description: "Size in m²",
    },
    {
      name: "boundCO2",
      type: "number",
      title: "Bound CO₂",
      description: "Bound CO₂ in tons", // TODO: what unit to use for this field? kg, ton kton?
    },
    { name: "architect", type: "string", title: "Architect" },
    { name: "propertyOwner", type: "string", title: "Property owner" },
    {
      name: "buildYear",
      type: "number",
      title: "Build year",
      validation: (Rule) => Rule.min(0).max(new Date().getFullYear()),
    },
    {
      name: "demolitionYear",
      type: "number",
      title: "Demolition year",
      validation: (Rule) =>
        Rule.min(0)
          .max(9999)
          .custom<number | undefined>((value, context) =>
            context.document?.state === "riven" && !value
              ? "Demolition year is required for demolished buildings"
              : true,
          ),
    },
    {
      name: "description",
      type: "text",
      title: "Stories about the building",
    },
    {
      name: "demolitionCause",
      type: "text",
      title: "Demolition cause",
    },
    {
      name: "images",
      type: "array",
      title: "Images",
      of: [{ type: "image" }],
    },
    {
      name: "sources",
      type: "text",
      title: "Image sources",
      rows: 4,
    },
    {
      name: "contributor",
      type: "object",
      title: "Contributor",
      fields: [
        { name: "name", type: "string", title: "Name" },
        {
          name: "email",
          type: "string",
          title: "Email",
          validation: (Rule) => Rule.custom(emailValidator),
        },
      ],
    },
  ],
  preview: {
    select: {
      category: "category",
      state: "state",
      blockName: "blockName",
      address: "address",
      postcode: "postcode",
      city: "city",
      reviewed: "reviewed",
    },
    prepare(selection) {
      const { reviewed, category, state, blockName, address, postcode, city } =
        selection;
      return {
        title: blockName ? blockName : `${address}, ${postcode} ${city}`,
        subtitle: categories.find((c) => c.value === category)?.title,
        media: (
          <span
            style={{
              backgroundColor:
                state === "riven"
                  ? "red"
                  : state === "hotad"
                  ? "yellow"
                  : "green",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {reviewed ? "" : "👀"}
          </span>
        ),
      };
    },
  },
};
