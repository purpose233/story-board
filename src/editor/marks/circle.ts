import type { IView } from '@visactor/vgrammar';
import { elementVisualConfig } from '../../config/visual';
import { BaseMark } from './base';
import type { CircleMarkVisual } from '../../typings/mark';

export class CircleMark extends BaseMark {
  type: 'circle';
  constructor(view: IView, visualConfig: CircleMarkVisual) {
    super(view, visualConfig);
    this.defaultVisual = elementVisualConfig.circle;
    this.type = 'circle';
  }
}
