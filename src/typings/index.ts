import type { GroupMarkVisual, RectMarkVisual, TextMarkVisual, CircleMarkVisual } from './mark';

export type IVisualConfig = IVisualTextConfig | IVisualGroupConfig | IVisualRectConfig | IVisualCircleConfig;

export interface IVisualTextConfig extends IVisualBaseConfig {
  channel: keyof GroupMarkVisual;
}
export interface IVisualGroupConfig extends IVisualBaseConfig {
  channel: keyof TextMarkVisual;
}
export interface IVisualRectConfig extends IVisualBaseConfig {
  channel: keyof RectMarkVisual;
}

export interface IVisualCircleConfig extends IVisualBaseConfig {
  channel: keyof CircleMarkVisual;
}

export interface IVisualBaseConfig {
  type: string | number | boolean;
  default: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any;
}

export type OrdinalField = {
  key: string;
  type: 'ordinal';
  range: unknown[];
  count: number;
};

export type NumericField = {
  key: string;
  type: 'number';
  range: [number, number];
};

export type DataField = OrdinalField | NumericField;
