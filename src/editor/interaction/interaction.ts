import type { IElement, InteractionEvent } from '@visactor/vgrammar';
import type { Editor } from '../editor';
import type { IRect } from '../../typings/common';

export class Interaction {
  private editor: Editor;
  private editElement = null;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  init() {
    this.editor.addEventListener('click', this.onEditorClick);
  }

  private onEditorClick = (e?: InteractionEvent, element?: IElement) => {
    if (element) {
      // console.log('picked element', element);
      const bounds = element.getBounds();
      const rect: IRect = {
        x: bounds.x1,
        y: bounds.y1,
        width: bounds.width(),
        height: bounds.height()
      };
    }
  };
}
