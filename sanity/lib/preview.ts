import { DefaultDocumentNodeResolver, StructureBuilder } from "sanity/desk";
import Iframe from "sanity-plugin-iframe-pane";

export const createPreview = (S: StructureBuilder) => [
  S.view.form(),
  S.view
    .component(Iframe)
    .options({
      url: `${
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
      }/api/preview`,
    })
    .title("Preview"),
];
