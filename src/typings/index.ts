import type { ScaleValueSpec } from '../editor/scales/base';
import type {
  GroupMarkVisual,
  RectMarkVisual,
  TextMarkVisual,
  CircleMarkVisual,
  ArcMarkVisual,
  AreaMarkVisual,
  ShapeMarkVisual,
  LineMarkVisual,
  SymbolMarkVisual,
  PolygonMarkVisual
} from './mark';

export type IVisualConfig =
  | IVisualTextConfig
  | IVisualGroupConfig
  | IVisualRectConfig
  | IVisualCircleConfig
  | IVisualArcConfig
  | IVisualAreaConfig
  | IVisualLineConfig
  | IVisualShapeConfig
  | IVisualSymbolConfig
  | IVisualPolygonConfig;

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

export interface IVisualArcConfig extends IVisualBaseConfig {
  channel: keyof ArcMarkVisual;
}

export interface IVisualAreaConfig extends IVisualBaseConfig {
  channel: keyof AreaMarkVisual;
}

export interface IVisualShapeConfig extends IVisualBaseConfig {
  channel: keyof ShapeMarkVisual;
}
export interface IVisualLineConfig extends IVisualBaseConfig {
  channel: keyof LineMarkVisual;
}
export interface IVisualSymbolConfig extends IVisualBaseConfig {
  channel: keyof SymbolMarkVisual;
}

export interface IVisualPolygonConfig extends IVisualBaseConfig {
  channel: keyof PolygonMarkVisual;
}

export interface IVisualBaseConfig {
  type: string | number | boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler?: (value: any) => any;
  defaultRange?: ScaleValueSpec;
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
