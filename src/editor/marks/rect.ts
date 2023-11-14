import type { IView } from '@visactor/vgrammar';
import { elementVisualConfig } from '../../config/visual';
import { BaseMark } from './base';
import type { RectMarkVisual } from '../../typings/mark';

export class RectMark extends BaseMark {
  readonly type: 'rect';
  constructor(view: IView, visualConfig: RectMarkVisual) {
    super(view, visualConfig);
    this.defaultVisual = elementVisualConfig.text;
    this.type = 'rect';
  }
}
