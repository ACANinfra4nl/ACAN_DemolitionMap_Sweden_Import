import { StructureBuilder } from "sanity/desk";
import Iframe from "sanity-plugin-iframe-pane";

export const createPreview = (S: StructureBuilder) => {
  console.log("createPreview for url", process.env.NEXT_PUBLIC_STUDIO_URL);
  return [
    S.view.form(),
    S.view
      .component(Iframe)
      .options({
        url: `${
          process.env.NEXT_PUBLIC_STUDIO_URL
            ? `https://${process.env.NEXT_PUBLIC_STUDIO_URL}`
            : "http://localhost:3000"
        }/api/preview`,
      })
      .title("Preview"),
  ];
};
