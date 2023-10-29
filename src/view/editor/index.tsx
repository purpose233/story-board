import { Layout } from "@douyinfe/semi-ui";
import { editorStoreInstance } from "../../store/element";
import { Toolbar } from "../../components/toolbar";
import { DataPanel } from "../../components/data-panel";
import { LayerPanel } from "../../components/layer-panel";
import { Playground } from "../../components/playground";
import { ConfigPanel } from "../../components/config-panel";

import "./index.css";

const { Header, Sider, Content } = Layout;

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
          <LayerPanel elementStore={editorStoreInstance} />
        </Sider>
        <Content>
          <Playground elementStore={editorStoreInstance} />
        </Content>
        <Sider
          style={{ width: "300px", background: "var(--semi-color-fill-2)" }}
        >
          <ConfigPanel elementStore={editorStoreInstance} />
        </Sider>
      </Layout>
    </Layout>
  );
};
