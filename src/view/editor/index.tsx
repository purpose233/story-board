import React, { useEffect, useRef } from 'react';
import { Layout } from '@douyinfe/semi-ui';
import { v4 as uuid } from 'uuid';
import type { Editor as MarksEditor } from '../../editor/editor';
import { Toolbar } from '../../components/toolbar';
import { DataPanel } from '../../components/data-panel';
import { LayerPanel } from '../../components/layer-panel';
import { ConfigPanel } from '../../components/config-panel';
import { Playground } from '../../components/playground';

import './index.less';

const { Header, Sider, Content } = Layout;

export const Editor = () => {
  const commonStyle = {
    height: 64,
    lineHeight: '64px',
    background: 'var(--semi-color-fill-0)'
  };

  const editorRef = useRef<MarksEditor | null>(null);

  return (
    <Layout style={{ width: '100%', height: '100%' }}>
      <Header style={commonStyle}>Story Board</Header>
      <Layout>
        <Sider style={{ width: '40px', background: 'var(--semi-color-bg-1)' }}>
          <Toolbar editorRef={editorRef} />
        </Sider>
        <Sider style={{ width: 240 }}>
          <DataPanel />
          <LayerPanel />
        </Sider>
        <Content>
          <Playground editorRef={editorRef} />
        </Content>
        <Sider style={{ width: '300px', background: 'var(--semi-color-fill-2)' }}>
          <ConfigPanel editorRef={editorRef} />
        </Sider>
      </Layout>
    </Layout>
  );
};
