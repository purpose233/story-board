import {
  IconArrowUpLeft,
  IconMaximize,
  IconMinus,
  IconText,
} from "@douyinfe/semi-icons";
import { Layout } from "@douyinfe/semi-ui";

const { Header, Sider, Content } = Layout;

const Toolbar = () => {
  return (
    <div>
      <IconArrowUpLeft />
      <IconText />
      <IconMinus />
      <IconMaximize />
    </div>
  );
};

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
          style={{ width: "120px", background: "var(--semi-color-fill-2)" }}
        >
          <Toolbar />
        </Sider>
        <Content style={{ height: 300, lineHeight: "300px" }}>Content</Content>
        <Sider
          style={{ width: "120px", background: "var(--semi-color-fill-2)" }}
        >
          Sider
        </Sider>
      </Layout>
    </Layout>
  );
};
