import { Card, Tree } from '@douyinfe/semi-ui';
import { observer } from 'mobx-react';
import { useEditorStore } from '../../store/element';
import type { ViewElement } from '../../editor/marks/base';
import type { TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree';

export const LayerPanel = observer(() => {
  const editorStore = useEditorStore();

  const elements = editorStore.viewElements;

  const generateTree = (element: ViewElement): TreeNodeData => {
    const node: TreeNodeData = {
      label: element.type,
      value: element.id,
      key: element.id,
      children: [] as TreeNodeData['children']
    };
    const children = element.children;
    if (children && children.length > 0) {
      node.children = children.map(v => generateTree(v));
    }
    return node;
  };

  const treeData = elements.map(element => {
    return generateTree(element);
  });

  // eslint-disable-next-line no-console
  console.log('treeData');
  // eslint-disable-next-line no-console
  console.log(treeData);

  const onSelect = (selectedKey: string) => {
    if (editorStore?.currentElement && selectedKey === editorStore.currentElement.id) {
      editorStore.setCurrentElement(null);
    } else {
      editorStore.setCurrentElement(selectedKey);
    }
  };

  return (
    <Card title="Layer Panel" style={{ width: '100%', height: 'calc(100% - 300px)' }}>
      <div style={{ width: '100%', height: '100%' }}>
        <Tree treeData={treeData} value={editorStore?.currentElement?.id} defaultExpandAll onSelect={onSelect} />
      </div>
    </Card>
  );
});
