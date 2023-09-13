import { SchemaTypeDefinition } from "sanity";

export const building: SchemaTypeDefinition = {
  name: "building",
  type: "document",
  title: "Byggnad",
  description: "Rivning rapporterad av användare",
  fields: [
    {
      name: "reviewed",
      type: "boolean",
      title: "Granskad",
      description:
        "Granskade byggnader visas på kartan och i listan på hemsidan.",
      initialValue: false,
    },
    {
      name: "location",
      type: "geopoint",
      title: "Plats",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "category",
      type: "string",
      title: "Kategori",
      options: {
        list: [
          "bostad",
          "kontor",
          "kommersiell",
          "samhällsfastighet",
          "industri",
          "övrig",
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "state",
      type: "string",
      title: "Status",
      options: {
        list: ["hotad", "riven", "räddad"],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "address",
      type: "string",
      title: "Adress",
    },
    {
      name: "postcode",
      type: "string",
      title: "Postnummer",
    },
    {
      name: "city",
      type: "string",
      title: "Postort",
    },
    {
      name: "blockName",
      type: "string",
      title: "Kvartersnamn",
    },
    {
      name: "propertyDesignation",
      type: "string",
      title: "Fastighetsbeteckning",
    },
    {
      name: "size",
      type: "number",
      title: "Storlek",
      description: "Storlek i m²",
    },
    {
      name: "boundCO2",
      type: "number",
      title: "Inbunden CO₂",
      description: "Inbunden CO₂ i ton", // TODO: what unit to use for this field? kg, ton kton?
    },
    { name: "architect", type: "string", title: "Arkitekt" },
    { name: "propertyOwner", type: "string", title: "Fastighetsägare" },
    {
      name: "buildYear",
      type: "number",
      title: "Byggår",
      validation: (Rule) =>
        Rule.required().min(0).max(new Date().getFullYear()),
    },
    {
      name: "demolitionYear",
      type: "number",
      title: "Rivningsår",
      validation: (Rule) => Rule.required().min(0).max(9999),
    },
    {
      name: "description",
      type: "text",
      title: "Beskrivning",
      description: "Arkitektur, historik, nuvarande verksamhet",
    },
    {
      name: "demolitionCause",
      type: "text",
      title: "Anledning till rivning",
    },
    {
      name: "images",
      type: "array",
      of: [{ type: "image" }],
      title: "Bilder",
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
        subtitle: category,
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
            {reviewed ? "" : "🆕"}
          </span>
        ),
      };
    },
  },
};
