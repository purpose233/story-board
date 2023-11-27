import type { IView } from '@visactor/vgrammar';
import { elementVisualConfig } from '../../config/visual';
import { BaseMark } from './base';
import type { PolygonMarkVisual } from '../../typings/mark';

export class PolygonlMark extends BaseMark {
  type: 'polygon';
  constructor(view: IView, visualConfig: PolygonMarkVisual) {
    super(view, visualConfig);
    this.defaultVisual = elementVisualConfig.polygon;
    this.type = 'polygon';
  }
}
