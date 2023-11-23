import type { IView } from '@visactor/vgrammar';
import { elementVisualConfig } from '../../config/visual';
import { BaseMark } from './base';
import type { LineMarkVisual } from '../../typings/mark';

export class LineMark extends BaseMark {
  type: 'line';
  constructor(view: IView, visualConfig: LineMarkVisual) {
    super(view, visualConfig);
    this.defaultVisual = elementVisualConfig.line;
    this.type = 'line';
  }
}
