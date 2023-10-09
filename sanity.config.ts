/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...index]]/page.tsx` route
 */

// import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { createPreview } from "./sanity/lib/preview";
import { groq } from "next-sanity";
import { visionTool } from "@sanity/vision";

const singletonActions = new Set(["publish", "discardChanges", "restore"]);
const singletonTypes = new Set(["manifest"]);

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema: {
    types: schemaTypes,

    // Filter out singleton types from the global “New document” menu options
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title("Innehåll")
          .items([
            S.listItem()
              .title("Granskade byggnader")
              .id("reviewed")
              .child(
                S.documentTypeList("building").filter(
                  groq`_type == "building" && reviewed == true`,
                ),
              ),
            S.listItem()
              .title("Ogranskade byggnader")
              .id("unreviewed")
              .child(
                S.documentTypeList("building").filter(
                  groq`_type == "building" && reviewed != true`,
                ),
              ),
            S.listItem()
              .title("Alla byggnader")
              .id("buildings")
              .child(
                S.documentTypeList("building").filter(
                  groq`_type == "building"`,
                ),
              ),
            S.divider(),
            S.listItem()
              .title("Manifest")
              .id("manifest")
              .child(
                S.document()
                  .schemaType("manifest")
                  .id("manifest")
                  .views(createPreview(S)),
              ),
          ]),
    }),

    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
});
