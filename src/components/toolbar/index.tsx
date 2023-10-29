import { Button } from "@douyinfe/semi-ui";
import {
  IconArrowUpLeft,
  IconMaximize,
  IconMinus,
  IconText,
} from "@douyinfe/semi-icons";
import type { IEditorElementConfig } from "../../typings";
import { v4 as uuid } from "uuid";
import { elementVisualConfig } from "../../config/visual";
import { useEditorStore } from "../../store/element";

export const Toolbar = () => {
  const editorStore = useEditorStore();
  return (
    <div>
      <Button className="editor-tool">
        <IconArrowUpLeft />
      </Button>
      <Button className="editor-tool">
        <IconText
          onClick={() => {
            const visuals: Record<string, any> = {};
            for (const visual of elementVisualConfig.text) {
              visuals[visual.channel] = visual.default;
            }
            const textElement: IEditorElementConfig = {
              id: uuid(),
              type: "text",
              visuals,
            };
            editorStore.addElement(textElement);
            editorStore.setCurrentElement(textElement.id);
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
