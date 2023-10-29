import { Card, Tree } from "@douyinfe/semi-ui";
import { observer } from "mobx-react";
import { EditorStore } from "../../store/element";

export const LayerPanel = observer((props: { elementStore: EditorStore }) => {
  const { elementStore } = props;

  const treeData = elementStore.elements.map((element) => {
    return {
      label: element.type,
      value: element.id,
      key: element.id,
    };
  });

  return (
    <Card
      title="Layer Panel"
      style={{ width: "100%", height: "calc(100% - 300px)" }}
    >
      <Tree treeData={treeData} defaultExpandAll />
    </Card>
  );
});
