import type { IView } from '@visactor/vgrammar';
import { elementVisualConfig } from '../../config/visual';
import { BaseMark } from './base';
import type { ArcMarkVisual, CommonMarkVisual } from '../../typings/mark';

export class ArcMark extends BaseMark {
  type: 'arc';
  constructor(view: IView, visualConfig: ArcMarkVisual) {
    super(view, visualConfig);
    this.defaultVisual = elementVisualConfig.arc;
    this.type = 'arc';
  }
}
