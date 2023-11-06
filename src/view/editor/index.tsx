import { Layout } from "@douyinfe/semi-ui";
import { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import { Editor as MarksEditor } from '../../editor/editor'
import { Toolbar } from "../../components/toolbar";
import { DataPanel } from "../../components/data-panel";
import { LayerPanel } from "../../components/layer-panel";
import { ConfigPanel } from "../../components/config-panel";

import "./index.css";

const { Header, Sider, Content } = Layout;

export const Editor = () => {
  const commonStyle = {
    height: 64,
    lineHeight: "64px",
    background: "var(--semi-color-fill-0)",
  };

  const containerRef = useRef<string>(uuid());

  const editorRef = useRef<MarksEditor|null>(null)

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      editorRef.current = new MarksEditor({
        container: containerRef.current,
      })
      editorRef.current.init()
      window.editor = editorRef.current
    }
    // return () => editorRef.current?.release()
  }, [])


  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      <Header style={commonStyle}>Header</Header>
      <Layout>
        <Sider
          style={{ width: "80px", background: "var(--semi-color-fill-2)" }}
        >
          <Toolbar editorRef={editorRef} />
        </Sider>
        <Sider style={{ width: 200 }}>
          <DataPanel />
          <LayerPanel />
        </Sider>
        <Content>
        <div style={{ width: "100%", height: "100%" }}>
          <div
            id={containerRef.current}
            style={{ position: "relative", width: "100%", height: "100%" }}
          ></div>
        </div>
          {/* <Playground /> */}
        </Content>
        <Sider
          style={{ width: "300px", background: "var(--semi-color-fill-2)" }}
        >
          <ConfigPanel editorRef={editorRef} />
        </Sider>
      </Layout>
    </Layout>
  );
};
