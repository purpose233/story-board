import type { IView } from '@visactor/vgrammar';
import { elementVisualConfig } from '../../config/visual';
import { BaseMark } from './base';
import type { AreaMarkVisual } from '../../typings/mark';

export class AreaMark extends BaseMark {
  type: 'area';
  constructor(view: IView, visualConfig: AreaMarkVisual) {
    super(view, visualConfig);
    this.defaultVisual = elementVisualConfig.area;
    this.type = 'area';
  }
}
