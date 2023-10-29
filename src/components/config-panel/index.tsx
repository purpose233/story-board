import { Card, Input, InputNumber, Switch } from "@douyinfe/semi-ui";
import { observer } from "mobx-react";
import { useEditorStore, type EditorStore } from "../../store/element";
import { elementVisualConfig } from "../../config/visual";
import { IEditorElementConfig } from "../../typings";

import "./index.css";

const generateVisuals = (
  elementConfig: IEditorElementConfig,
  editorStore: EditorStore
) => {
  const visualConfig = elementVisualConfig[elementConfig.type];
  if (visualConfig) {
    return visualConfig.map((visual) => {
      const value = elementConfig.visuals[visual.channel] ?? visual.default;
      const onChange = (nextValue: any) => {
        if (editorStore.currentElement) {
          const element = editorStore.currentElement;
          const visuals = Object.assign({}, element.visuals, {
            [visual.channel]: nextValue,
          });
          const nextElement = Object.assign({}, element, { visuals });
          editorStore.updateElement(nextElement);
        }
      };
      switch (visual.type) {
        case "string":
          return (
            <div className="config-panel-entry" key={visual.channel}>
              <span className="config-panel-entry-label">
                {visual.channel}:
              </span>
              <Input
                defaultValue={value}
                onChange={onChange}
                style={{ width: 180 }}
              ></Input>
            </div>
          );
        case "number":
          return (
            <div className="config-panel-entry" key={visual.channel}>
              <span className="config-panel-entry-label">
                {visual.channel}:
              </span>
              <InputNumber
                defaultValue={value}
                onChange={onChange}
                style={{ width: 180 }}
              />
            </div>
          );
        case "color":
          return (
            <div className="config-panel-entry" key={visual.channel}>
              <span className="config-panel-entry-label">
                {visual.channel}:
              </span>
              <Input
                defaultValue={value}
                onChange={onChange}
                style={{ width: 180 }}
              ></Input>
            </div>
          );
        case "boolean":
          return (
            <div className="config-panel-entry" key={visual.channel}>
              <span className="config-panel-entry-label">
                {visual.channel}:
              </span>
              <Switch defaultChecked={value} onChange={onChange}></Switch>
            </div>
          );
      }
      return null;
    });
  }
  return null;
};

export const ConfigPanel = observer(() => {
  const editorStore = useEditorStore();

  return (
    <Card title="Config Panel" style={{ width: "100%", height: "100%" }}>
      {editorStore.currentElement
        ? generateVisuals(editorStore.currentElement, editorStore)
        : null}
    </Card>
  );
});
