/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...index]]/page.tsx` route
 */

// import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schema";
import Iframe from "sanity-plugin-iframe-pane";
import { createPreview } from "./sanity/lib/preview";
import { groq } from "next-sanity";

const singletonActions = new Set(["publish", "discardChanges", "restore"]);
const singletonTypes = new Set(["manifest"]);

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
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
                  groq`_type == "building" && reviewed == true`
                )
              ),
            S.listItem()
              .title("Ogranskade byggnader")
              .id("unreviewed")
              .child(
                S.documentTypeList("building").filter(
                  groq`_type == "building" && reviewed != true`
                )
              ),
            S.divider(),
            S.listItem()
              .title("Manifest")
              .id("manifest")
              .child(
                S.document()
                  .schemaType("manifest")
                  .id("manifest")
                  .views(createPreview(S))
              ),
          ]),
    }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    // visionTool({ defaultApiVersion: apiVersion }),
  ],
});
