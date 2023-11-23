import type { BasicEncoderSpecMap, GenerateEncoderSpec } from '@visactor/vgrammar';
import type { BaseMark } from '../editor/marks/base';
import type { GroupMark } from '../editor/marks/group';
import type { TextMark } from '../editor/marks/text';
import type { ArcMark } from '../editor/marks/arc';
import type { CircleMark } from '../editor/marks/circle';
import type { AreaMark } from '../editor/marks/area';
import type { ShapeMark } from '../editor/marks/shape';
import type { LineMark } from '../editor/marks/line';
import type { SymbolMark } from '../editor/marks/symbol';
import type { PolygonlMark } from '../editor/marks/polygon';

export enum MarkType {
  group = 'group',
  text = 'text',
  rect = 'rect',
  circle = 'circle',
  arc = 'arc',
  area = 'area',
  shape = 'shape',
  line = 'line',
  symbol = 'symbol',
  polygon = 'polygon'
}

export type CommonMark =
  | BaseMark
  | TextMark
  | GroupMark
  | ArcMark
  | CircleMark
  | AreaMark
  | ShapeMark
  | LineMark
  | SymbolMark
  | PolygonlMark;

export type CommonMarkSpec = CommonMarkVisual;
export type CommonMarkVisual =
  | TextMarkVisual
  | GroupMarkVisual
  | RectMarkVisual
  | CircleMarkVisual
  | ArcMarkVisual
  | AreaMarkVisual
  | ShapeMarkVisual
  | LineMarkVisual
  | SymbolMarkVisual
  | PolygonMarkVisual;

export type TextMarkVisual = GenerateEncoderSpec<BasicEncoderSpecMap[MarkType.text]>;
export type GroupMarkVisual = GenerateEncoderSpec<BasicEncoderSpecMap[MarkType.group]>;
export type RectMarkVisual = GenerateEncoderSpec<BasicEncoderSpecMap[MarkType.rect]>;
export type CircleMarkVisual = GenerateEncoderSpec<BasicEncoderSpecMap[MarkType.circle]>;
export type ArcMarkVisual = GenerateEncoderSpec<BasicEncoderSpecMap[MarkType.arc]>;
export type AreaMarkVisual = GenerateEncoderSpec<BasicEncoderSpecMap[MarkType.area]>;
export type ShapeMarkVisual = GenerateEncoderSpec<BasicEncoderSpecMap[MarkType.shape]>;
export type LineMarkVisual = GenerateEncoderSpec<BasicEncoderSpecMap[MarkType.line]>;
export type SymbolMarkVisual = GenerateEncoderSpec<BasicEncoderSpecMap[MarkType.symbol]>;
export type PolygonMarkVisual = GenerateEncoderSpec<BasicEncoderSpecMap[MarkType.polygon]>;

type CommonKeys<T> = T extends unknown ? keyof T : never;
export type MarkVisualKeys = CommonKeys<
  | TextMarkVisual
  | GroupMarkVisual
  | RectMarkVisual
  | ArcMarkVisual
  | AreaMarkVisual
  | ShapeMarkVisual
  | LineMarkVisual
  | SymbolMarkVisual
  | PolygonMarkVisual
>;
