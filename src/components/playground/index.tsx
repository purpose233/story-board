import { useRef } from "react";
import { observer } from "mobx-react";
import { v4 as uuid } from "uuid";
import { useEditorStore } from "../../store/element";


export const Playground = observer(() => {
  const containerRef = useRef<string>(uuid());

  const editorStore = useEditorStore();

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        id={containerRef.current}
        style={{ position: "relative", width: "100%", height: "100%" }}
      ></div>
    </div>
  );
});
