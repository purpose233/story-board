import type { MarkType } from './mark';

export enum CommonOperateType {
  pointer = 'pointer'
}

export type OperationType = MarkType | CommonOperateType;
