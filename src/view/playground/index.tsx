import React, { useCallback, useEffect, type RefObject } from 'react';
import { observer } from 'mobx-react';
import { type Editor, Editor as MarksEditor } from '../../editor/editor';
import { useEditorStore } from '../../store/element';
import { elementVisualConfig, getDefaultVisual } from '../../config/visual';
import type { CommonMarkVisual } from '../../typings/mark';
import { editorContainerId } from '../../config/editor';
import { CommonOperateType } from '../../typings/editor';

interface Props {
  editorRef: RefObject<Editor>;
}

export const Playground = observer(({ editorRef }: Props) => {
  const editorStore = useEditorStore();

  useEffect(() => {
    if (!editorRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      editorRef.current = new MarksEditor({
        container: editorContainerId
      });
      editorRef.current.init();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.editor = editorRef.current;
    }
    return () => {
      editorRef.current?.release();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      editorRef.current = null;
    };
  }, []);

  const createElement = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const originEvent = e.nativeEvent;
      const x = originEvent.offsetX;
      const y = originEvent.offsetY;
      const type = editorStore.currentOperationType as string;
      // const defaultVisualConfigList = elementVisualConfig[type];
      const defaultVisualConfig: CommonMarkVisual = getDefaultVisual(type);
      const editor = editorRef.current!;
      let groupId;
      const currentElement = editorStore.currentElement;
      if (currentElement?.type === 'group') {
        groupId = currentElement.id;
      } else if (currentElement?.id) {
        groupId = editor.getElementById(currentElement.id)?.group?.id;
      }
      const id = editor.createElement(type, { ...defaultVisualConfig, x, y }, groupId);
      editorStore.addElement(editor.getViewElementById(id)!);
      editorStore.setCurrentElement(id);
      editorStore.updateViewElements(editor.getViewElements());
      editor.render();
    },
    [editorRef, editorStore]
  );

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const type = editorStore.currentOperationType as string;
    if (type !== CommonOperateType.pointer) {
      createElement(e);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', background: '#eee' }} onClick={e => onClick(e)}>
      <div id={editorContainerId} style={{ position: 'relative', width: '100%', height: '100%' }}></div>
    </div>
  );
});
