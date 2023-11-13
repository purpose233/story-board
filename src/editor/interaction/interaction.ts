import type { IElement, InteractionEvent } from '@visactor/vgrammar';
import type { Editor } from '../editor';
import type { IRect } from '../../typings/common';
import type { BaseMark } from '../marks/base';
import { ResizeController } from './resize-controller';

export class Interaction {
  private editor: Editor;
  private editMark: BaseMark | null = null;
  private resizeController: ResizeController | null = null;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  init() {
    this.editor.addEventListener('click', this.onEditorClick);
  }

  private onEditorClick = (event?: InteractionEvent, element?: IElement) => {
    if (element) {
      // eslint-disable-next-line
      const targetId = (element.mark as any)?.viewContext?.id;
      if (!targetId) {
        return;
      }
      const bounds = element.getBounds();
      const rect: IRect = {
        x: bounds.x1,
        y: bounds.y1,
        width: bounds.width(),
        height: bounds.height()
      };
      const nextEditMark = this.editor.getElementById(targetId);
      if (this.editMark === nextEditMark) {
        return;
      }
      if (this.editMark) {
        this.editMark = null;
        this.resizeController?.release?.();
        this.resizeController = null;
      }
      this.editMark = nextEditMark;
      this.resizeController = new ResizeController(this.editor);
      this.resizeController.init();
      this.resizeController.render(rect);
      this.resizeController.addResizeListener(this.onResize);
    }
  };

  private onResize = (event: InteractionEvent | undefined, rect: IRect) => {
    // console.log(rect);
  };
}
