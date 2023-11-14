import type { IElement, InteractionEvent } from '@visactor/vgrammar';
import type { Editor } from '../editor';
import type { IRect } from '../../typings/common';
import type { BaseMark } from '../marks/base';
import { ResizeController } from './resize-controller';
import { MarkType } from '../../typings/mark';
import { useEditorStore } from '../../store/element';

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
    // eslint-disable-next-line
    const targetId = (element?.mark as any)?.viewContext?.id;
    const nextEditMark = this.editor.getElementById(targetId);
    if (!element || !targetId || !nextEditMark) {
      this.editMark = null;
      this.resizeController?.release?.();
      this.resizeController = null;
      return;
    }
    const bounds = element.getBounds();
    const rect: IRect = {
      x: bounds.x1,
      y: bounds.y1,
      width: bounds.width(),
      height: bounds.height()
    };
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
    this.resizeController.addResizeEndListener(this.onResize);
  };

  private onResize = (event: InteractionEvent | undefined, rect: IRect) => {
    if (!this.editMark) {
      return;
    }
    const editorStore = useEditorStore();
    if (this.editMark.type === MarkType.rect) {
      this.editMark.updateVisuals('x', rect.x);
      this.editMark.updateVisuals('y', rect.y);
      this.editMark.updateVisuals('width', rect.width);
      this.editMark.updateVisuals('height', rect.height);
      editorStore.updateElement(this.editMark.getViewElement());
      this.editor.render();
    }
  };
}
