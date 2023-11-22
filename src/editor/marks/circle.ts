import type { IView } from '@visactor/vgrammar';
import { elementVisualConfig } from '../../config/visual';
import { BaseMark } from './base';
import type { TextMarkVisual } from '../../typings/mark';

export class CircleMark extends BaseMark {
  type: 'circle';
  constructor(view: IView, visualConfig: TextMarkVisual) {
    super(view, visualConfig);
    this.defaultVisual = elementVisualConfig.circle;
    this.type = 'circle';
  }
}
