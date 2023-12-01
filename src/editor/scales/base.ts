import type { IView, ScaleFunctionType, ScaleData, GrammarScaleType, IScale, MultiScaleData } from '@visactor/vgrammar';
import { v4 } from 'uuid';
import type { Data } from '../data/base';

export interface ScaleViewElement {
  type: string;
  range: ScaleValueSpec;
  id: string;
  field: string;
  dataId: string;
}

export interface ScaleSpec {
  type: GrammarScaleType;
  data: Data;
  field: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ScaleValueSpec = ScaleData | MultiScaleData | ScaleFunctionType<any[]>;
export class Scale {
  private view: IView;
  private range: ScaleValueSpec = [];
  // private domain: ScaleValueSpec = [];
  readonly id: string;
  readonly type: GrammarScaleType;
  readonly field: string;
  readonly data: Data;
  instance: IScale | null;
  // spec: BaseScaleSpec;
  spec: ScaleSpec;

  constructor(view: IView, spec: ScaleSpec) {
    const { type, data, field } = spec;
    this.spec = spec;
    this.range = [];
    // this.domain = {
    //   data: data.id,
    //   field
    // };
    this.view = view;
    this.type = type;
    this.field = field;
    this.data = data;
    this.instance = null;
    this.id = v4();
  }

  // setDomain(domain: ScaleValueSpec) {
  //   this.domain = domain;
  // }

  setRange(range: ScaleValueSpec) {
    this.range = range;
  }

  // getDomain() {
  //   return this.domain;
  // }

  getRange() {
    return this.range;
  }

  compileDomain() {
    return {
      data: this.data.id,
      field: this.field
    };
  }

  compile() {
    this.instance = this.view
      .scale(this.type)
      .domain(this.compileDomain())
      .range(this.range)
      .id(this.id)
      .depend(['viewBox']);
    return this.instance;
  }

  getViewElement(): ScaleViewElement {
    return {
      type: this.type,
      field: this.field,
      dataId: this.data.id,
      range: this.range,
      id: this.id
    };
  }
}
