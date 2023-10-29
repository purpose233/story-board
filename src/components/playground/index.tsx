import { useEffect, useRef } from "react";
import { observer } from "mobx-react";
import { EditorStore } from "../../store/element";
import { IView, View, BaseSignleEncodeSpec } from "@visactor/vgrammar";

export const Playground = observer((props: { elementStore: EditorStore }) => {
  const { elementStore } = props;

  const viewRef = useRef<IView | null>(null);

  if (viewRef.current) {
    const view = viewRef.current;
    view.removeAllGrammars();
    for (const element of elementStore.elements) {
      const encoders: BaseSignleEncodeSpec = {};
      Object.keys(element.visuals).forEach((channel) => {
        encoders[channel] = element.visuals[channel];
      });
      view.mark(element.type, view.rootMark).encode(encoders);
      console.log("view run async", encoders);
    }
    view.runAsync();
    console.log("view run async", view);
  }

  useEffect(() => {
    const view = new View({
      width: 500,
      height: 500,
      container: "render-container",
      logLevel: 3,
    });
    viewRef.current = view;
    console.log("view create", view);
    (window as any).view = view;
    return () => view.release();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        id="render-container"
        style={{ position: "relative", width: "100%", height: "100%" }}
      ></div>
    </div>
  );
});
