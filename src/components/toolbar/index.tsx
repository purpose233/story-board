import { Icon } from './components/Icon';
import { faCircle, faSquare, faObjectUngroup } from '@fortawesome/free-regular-svg-icons';
import { faFont } from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react';
import { useEditorStore } from '../../store/element';
import { type RefObject } from 'react';
import type { Editor } from '../../editor/editor';
import { MarkType } from '../../typings/mark';

import './index.less';

interface Props {
  editorRef: RefObject<Editor>;
}

enum OtherOperateType {}

export type OperationType = MarkType | OtherOperateType;

export const Toolbar = observer(({ editorRef }: Props) => {
  const editorStore = useEditorStore();
  const { currentOperationType } = editorStore;
  // const { editor } = props

  // const createElement = (type: string) => {
  //   const defaultVisualConfigList = elementVisualConfig[type];
  //   const defaultVisualConfig: CommonMarkVisual = defaultVisualConfigList.reduce((acc, cur) => {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     (acc as any)[cur.channel] = cur.default;
  //     return acc;
  //   }, {} as CommonMarkVisual);
  //   const editor = editorRef.current!;
  //   let groupId;
  //   const currentElement = editorStore.currentElement;
  //   if (currentElement?.type === 'group') {
  //     groupId = currentElement.id;
  //   }
  //   const id = editor.createElement(type, defaultVisualConfig, groupId);
  //   editorStore.addElement(editor.getViewElementById(id));
  //   editorStore.setCurrentElement(id);
  //   editorStore.updateViewElements(editor.getViewElements());
  //   editor.render();
  // };

  return (
    <div className="toolbar-container">
      <Icon
        active={currentOperationType === MarkType.circle}
        icon={faCircle}
        tip="圆"
        onClick={() => editorStore.updateCurrentOperationType(MarkType.circle)}
      />
      <Icon
        active={currentOperationType === MarkType.rect}
        icon={faSquare}
        tip="矩形"
        onClick={() => editorStore.updateCurrentOperationType(MarkType.rect)}
      />
      <Icon
        active={currentOperationType === MarkType.group}
        icon={faObjectUngroup}
        tip="组"
        onClick={() => editorStore.updateCurrentOperationType(MarkType.group)}
      />
      <Icon
        active={currentOperationType === MarkType.text}
        icon={faFont}
        tip="文字"
        onClick={() => editorStore.updateCurrentOperationType(MarkType.text)}
      />
    </div>
  );
});
