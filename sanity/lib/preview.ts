import { StructureBuilder } from "sanity/desk";
import Iframe from "sanity-plugin-iframe-pane";

/** Must match server `SANITY_PREVIEW_SECRET`. Exposed via NEXT_PUBLIC_* for iframe URL only. */
const previewSecret =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET || ""
    : "";

export const createPreview = (S: StructureBuilder) => [
  S.view.form(),
  S.view
    .component(Iframe)
    .options({
      url:
        `${document.location.origin}/api/preview?secret=` +
        encodeURIComponent(previewSecret),
    })
    .title("Preview"),
];
