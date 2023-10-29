import { useEffect } from "react";
import {
  IconArrowUpLeft,
  IconMaximize,
  IconMinus,
  IconText,
} from "@douyinfe/semi-icons";
import { Button, Card, Layout } from "@douyinfe/semi-ui";
import { observer } from "mobx-react";
import { EditorStore, editorStoreInstance } from "../../store/element";
import { v4 as uuid } from "uuid";
import type { IEditorElementConfig } from "../../typings";

import "./index.css";

const { Header, Sider, Content } = Layout;

const Toolbar = () => {
  return (
    <div>
      <Button className="editor-tool">
        <IconArrowUpLeft />
      </Button>
      <Button className="editor-tool">
        <IconText
          onClick={() => {
            const textElement: IEditorElementConfig = {
              id: uuid(),
              type: "text",
              position: { x: 100, y: 100 },
              visuals: {
                text: "文本元素",
              },
            };
            editorStoreInstance.addElement(textElement);
          }}
        />
      </Button>
      <Button className="editor-tool">
        <IconMinus />
      </Button>
      <Button className="editor-tool">
        <IconMaximize />
      </Button>
    </div>
  );
};

const DataPanel = () => {
  return (
    <Card title="Data Panel" style={{ width: "100%", height: 300 }}>
      <div>Entries</div>
    </Card>
  );
};

const LayerPanel = () => {
  return (
    <Card
      title="Layer Panel"
      style={{ width: "100%", height: "calc(100% - 300px)" }}
    ></Card>
  );
};

const ConfigPanel = () => {
  return (
    <Card title="Config Panel" style={{ width: "100%", height: "100%" }}></Card>
  );
};

const Playground = observer((props: { elementStore: EditorStore }) => {
  const { elementStore } = props;
  console.log(elementStore.elements);

  useEffect(() => {
    // const view =
  }, elementStore.elements);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        id="render-container"
        style={{ position: "relative", width: "100%", height: "100%" }}
      ></div>
    </div>
  );
});

export const Editor = () => {
  const commonStyle = {
    height: 64,
    lineHeight: "64px",
    background: "var(--semi-color-fill-0)",
  };
  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      <Header style={commonStyle}>Header</Header>
      <Layout>
        <Sider
          style={{ width: "80px", background: "var(--semi-color-fill-2)" }}
        >
          <Toolbar />
        </Sider>
        <Sider style={{ width: 200 }}>
          <DataPanel />
          <LayerPanel />
        </Sider>
        <Content>
          <Playground elementStore={editorStoreInstance} />
        </Content>
        <Sider
          style={{ width: "300px", background: "var(--semi-color-fill-2)" }}
        >
          <ConfigPanel />
        </Sider>
      </Layout>
    </Layout>
  );
};
