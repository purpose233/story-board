import type { IView } from '@visactor/vgrammar';
import type { GroupMarkVisual, RectMarkVisual, TextMarkVisual } from './mark';
import type { Editor } from '../editor/editor';

export type IVisualConfig = IVisualTextConfig | IVisualGroupConfig | IVisualRectConfig;

export interface IVisualTextConfig extends IVisualBaseConfig {
  channel: keyof GroupMarkVisual;
}
export interface IVisualGroupConfig extends IVisualBaseConfig {
  channel: keyof TextMarkVisual;
}
export interface IVisualRectConfig extends IVisualBaseConfig {
  channel: keyof RectMarkVisual;
}

export interface IVisualBaseConfig {
  type: string | number | boolean;
  default: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any;
}
