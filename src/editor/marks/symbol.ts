import type { IView } from '@visactor/vgrammar';
import { elementVisualConfig } from '../../config/visual';
import { BaseMark } from './base';
import type { SymbolMarkVisual } from '../../typings/mark';

export class SymbolMark extends BaseMark {
  type: 'symbol';
  constructor(view: IView, visualConfig: SymbolMarkVisual) {
    super(view, visualConfig);
    this.defaultVisual = elementVisualConfig.symbol;
    this.type = 'symbol';
  }
}
