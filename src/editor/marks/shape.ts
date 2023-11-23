import type { IView } from '@visactor/vgrammar';
import { elementVisualConfig } from '../../config/visual';
import { BaseMark } from './base';
import type { ShapeMarkVisual } from '../../typings/mark';

export class ShapeMark extends BaseMark {
  type: 'shape';
  constructor(view: IView, visualConfig: ShapeMarkVisual) {
    super(view, visualConfig);
    this.defaultVisual = elementVisualConfig.shape;
    this.type = 'shape';
  }
}
