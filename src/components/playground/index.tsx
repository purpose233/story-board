import { useEffect, useRef } from "react";
import { observer } from "mobx-react";
import type { IView, BaseSignleEncodeSpec } from "@visactor/vgrammar";
import { View } from "@visactor/vgrammar";
import { v4 as uuid } from "uuid";
import { useEditorStore, type EditorStore } from "../../store/element";
import { IEditorElementConfig } from "../../typings";

const renderView = (view: IView, elements: IEditorElementConfig[]) => {
  view.removeAllGrammars();
  for (const element of elements) {
    const encoders: BaseSignleEncodeSpec = {};
    Object.keys(element.visuals).forEach((channel) => {
      encoders[channel] = element.visuals[channel];
    });
    view.mark(element.type, view.rootMark).encode(encoders);
  }
  view.runAsync();
  console.log("view run async", view);
};

export const Playground = observer(() => {
  const containerRef = useRef<string>(uuid());

  const editorStore = useEditorStore();

  useEffect(() => {
    const view = new View({
      width: 500,
      height: 500,
      container: containerRef.current,
      logLevel: 3,
    });
    console.log("view create", view);
    (window as any).view = view;

    renderView(view, editorStore.elements);

    return () => {
      console.log("view release");
      view.release();
    };
  }, [editorStore.elements]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        id={containerRef.current}
        style={{ position: "relative", width: "100%", height: "100%" }}
      ></div>
    </div>
  );
});
