import type { IView } from '@visactor/vgrammar';
import { elementVisualConfig } from '../../config/visual';
import { BaseMark } from './base';
import type { TextMarkVisual } from '../../typings/mark';

export class TextMark extends BaseMark {
  readonly type: 'text';
  constructor(view: IView, visualConfig: TextMarkVisual) {
    super(view, visualConfig);
    this.defaultVisual = elementVisualConfig.text;
    this.type = 'text';
  }
}
