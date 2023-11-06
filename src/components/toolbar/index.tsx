import { Button } from "@douyinfe/semi-ui";
import {
  IconArrowUpLeft,
  IconMaximize,
  IconMinus,
  IconText,
  IconGridSquare,
} from "@douyinfe/semi-icons";
import { useEditorStore } from "../../store/element";
import type { RefObject } from "react";
import type { Editor } from "../../editor/editor";
import { elementVisualConfig } from "../../config/visual";
import type { CommonMarkVisual } from "../../typings/mark";

interface Props {
  editorRef: RefObject<Editor>
}

export const Toolbar = ({ editorRef }: Props) => {
  const editorStore = useEditorStore();
  // const { editor } = props

  const createElement = (type: string) => {
    const defaultVisualConfigList = elementVisualConfig[type]
    const defaultVisualConfig: CommonMarkVisual = defaultVisualConfigList.reduce((acc, cur) => {
      (acc as any)[cur.channel] = cur.default
      return acc
    }, {} as CommonMarkVisual)
    const editor = editorRef.current!
    let groupId
    const currentElement = editorStore.currentElement
    if (currentElement?.type === 'group') {
      groupId = currentElement.id
    }
    const id = editor.createElement(type, defaultVisualConfig, groupId)
    editorStore.addElement(editor.getViewElementById(id));
    editorStore.setCurrentElement(id);
    editorStore.updateViewElements(editor.getViewElements())
    editor.render()
  }
  return (
    <div>
      <Button className="editor-tool">
        <IconArrowUpLeft />
      </Button>
      <Button className="editor-tool">
        <IconText
          onClick={() => {
            createElement('text')
          }}
        />
      </Button>
      <Button className="editor-tool">
        <IconGridSquare
          onClick={() => {
            createElement('group')
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
