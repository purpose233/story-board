import type { RefObject } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Dropdown, Tree } from '@douyinfe/semi-ui';
import { observer } from 'mobx-react';
import { useEditorStore } from '../../store/element';
import type { ViewElement } from '../../editor/marks/base';
import type { OnDragProps, RenderFullLabelProps, TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree';

import './index.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import type { Editor } from '../../editor/editor';

interface Props {
  editorRef: RefObject<Editor>;
}

export const LayerPanel = observer(({ editorRef }: Props) => {
  const editorStore = useEditorStore();

  const elements = editorStore.viewElements;
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
  const [selectedThroughParent, setSelectedThroughParent] = useState(new Set());
  const [selected, setSelected] = useState(new Set());
  const editor = editorRef.current!;

  const generateTree = useCallback((element: ViewElement): TreeNodeData => {
    const node: TreeNodeData = {
      label: element.type,
      value: element.id,
      key: element.id,
      type: element.type,
      children: [] as TreeNodeData['children']
    };
    const children = element.children;
    if (children && children.length > 0) {
      node.children = children.map(v => generateTree(v));
    }
    return node;
  }, []);

  useEffect(() => {
    const treeData = elements.map(element => {
      return generateTree(element);
    });
    setTreeData(treeData);
  }, [elements, generateTree]);

  useEffect(() => {
    setSelected(new Set([editorStore.currentElement?.id]));
  }, [editorStore.currentElement]);

  // eslint-disable-next-line no-console
  console.log('treeData');
  // eslint-disable-next-line no-console
  console.log(treeData);

  const onDrop = (info: OnDragProps) => {
    const { dropToGap, node, dragNode } = info;
    const toId = node.key;
    const fromId = dragNode.key;
    const dropPos = node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const toNode = editor.getElementById(toId)!;
    const relativeDropPosition = dropPosition - Number(dropPos[dropPos.length - 1]);
    // drag to a node
    if (!dropToGap) {
      if (toNode.type === 'group') {
        editor.move(fromId, toNode.id, 0);
      } else {
        editor.move(fromId, toNode.group?.id, toNode.getIndex());
      }
    } else {
      // drag between two nodes
      const index = relativeDropPosition === 1 ? toNode.getIndex() + 1 : toNode.getIndex();
      editor.move(fromId, toNode.group?.id, index);
    }
    editorStore.updateViewElements(editor.getViewElements());
    editor.render();
  };

  const findDescendantKeys = (node: TreeNodeData) => {
    const res = [node.key];
    const findChild = (item: TreeNodeData) => {
      if (!item) {
        return;
      }
      const { children } = item;

      if (children && children.length) {
        children.forEach(child => {
          res.push(child.key);
          findChild(child);
        });
      }
    };
    findChild(node);
    return res;
  };

  const handleSelect = (selectedKey: string, selected: boolean, selectedNode: TreeNodeData) => {
    setSelected(new Set([selectedKey]));
    const descendantKeys = findDescendantKeys(selectedNode);
    setSelectedThroughParent(new Set(descendantKeys));
    if (editorStore?.currentElement && selectedKey === editorStore.currentElement.id) {
      editorStore.setCurrentElement(null);
    } else {
      editorStore.setCurrentElement(selectedKey);
    }
  };

  const clickDeleteButton = (e: React.MouseEvent<SVGSVGElement>, id: string) => {
    e.stopPropagation();
    const editor = editorRef.current!;
    editor.delete(id);
    editorStore.updateViewElements(editor.getViewElements());
    editor.render();
  };

  const renderLabel = ({ className, data, onClick, expandIcon }: RenderFullLabelProps) => {
    const { label, icon, key } = data;
    const isLeaf = !(data.children && data.children.length);
    const selectedClass = selected.has(key) ? 'group-selected' : selectedThroughParent.has(key) ? 'leaf-selected' : '';
    return (
      <li className={`${className} ${selectedClass}`} role="treeitem" onClick={onClick}>
        {isLeaf ? <span style={{ width: 24 }}></span> : expandIcon}
        {icon}
        <p className="tree-item">
          <span>{label}</span>
          <FontAwesomeIcon
            className="delete-icon"
            icon={faTrashCan}
            onClick={(e: React.MouseEvent<SVGSVGElement>) => clickDeleteButton(e, data.key)}
          />
        </p>
      </li>
    );
  };

  return (
    <Card title="Layer Panel" style={{ width: '100%', height: 'calc(100% - 300px)' }}>
      <div style={{ width: '100%', height: '100%' }}>
        <Tree
          className="layer-tree"
          treeData={treeData}
          value={editorStore?.currentElement?.id}
          onDrop={onDrop}
          renderFullLabel={renderLabel}
          defaultExpandAll
          onSelect={handleSelect}
          draggable
        />
      </div>
    </Card>
  );
});
