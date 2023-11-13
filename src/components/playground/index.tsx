import React, { useCallback, useEffect, type RefObject } from 'react';
import { observer } from 'mobx-react';
import { type Editor, Editor as MarksEditor } from '../../editor/editor';
import { useEditorStore } from '../../store/element';
import { elementVisualConfig } from '../../config/visual';
import type { CommonMarkVisual } from '../../typings/mark';
import { editorContainerId } from '../../config/editor';

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
      const defaultVisualConfigList = elementVisualConfig[type];
      const defaultVisualConfig: CommonMarkVisual = defaultVisualConfigList.reduce((acc, cur) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc as any)[cur.channel] = cur.default;
        return acc;
      }, {} as CommonMarkVisual);
      const editor = editorRef.current!;
      let groupId;
      const currentElement = editorStore.currentElement;
      if (currentElement?.type === 'group') {
        groupId = currentElement.id;
      }
      const id = editor.createElement(type, { ...defaultVisualConfig, x, y }, groupId);
      editorStore.addElement(editor.getViewElementById(id));
      editorStore.setCurrentElement(id);
      editorStore.updateViewElements(editor.getViewElements());
      editor.render();
    },
    [editorRef, editorStore]
  );

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={e => createElement(e)}>
      <div id={editorContainerId} style={{ position: 'relative', width: '100%', height: '100%' }}></div>
    </div>
  );
});
