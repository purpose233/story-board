import type { BasicEncoderSpecMap, GenerateEncoderSpec } from '@visactor/vgrammar';
import type { BaseMark } from '../editor/marks/base';
import type { GroupMark } from '../editor/marks/group';
import type { TextMark } from '../editor/marks/text';

export enum MarkType {
  group = 'group',
  text = 'text',
  rect = 'rect'
}

export type CommonMark = BaseMark | TextMark | GroupMark;
export type CommonMarkSpec = CommonMarkVisual;
export type CommonMarkVisual = TextMarkVisual | GroupMarkVisual | RectMarkVisual;

export type TextMarkVisual = GenerateEncoderSpec<BasicEncoderSpecMap[MarkType.text]>;
export type GroupMarkVisual = GenerateEncoderSpec<BasicEncoderSpecMap[MarkType.group]>;
export type RectMarkVisual = GenerateEncoderSpec<BasicEncoderSpecMap[MarkType.rect]>;

type CommonKeys<T> = T extends unknown ? keyof T : never;
export type MarkVisualKeys = CommonKeys<TextMarkVisual | GroupMarkVisual | RectMarkVisual>;
