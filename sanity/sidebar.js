import React from "react";
import S from "@sanity/desk-tool/structure-builder";

export default function Sidebar() {
  return S.list()
    .title(`Slick's Slices`)
    .items([
      S.listItem()
        .title("Home Page")
        .icon(() => <strong>🔥</strong>)
        .child(S.editor().schemaType("storeSettings").documentId("downtown")),
      // add in the rest of the list items.
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "storeSettings"
      ),
    ]);
}
