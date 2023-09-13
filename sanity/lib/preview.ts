import { StructureBuilder } from "sanity/desk";
import Iframe from "sanity-plugin-iframe-pane";

export const createPreview = (S: StructureBuilder) => [
  S.view.form(),
  S.view
    .component(Iframe)
    .options({
      url: `${document.location.origin}/api/preview`,
    })
    .title("Preview"),
];
