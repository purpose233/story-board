import type { IData, IView } from '@visactor/vgrammar';
import { v4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyValue = any[];

export class Data {
  private view: IView;
  private instance: IData | null;
  private values: AnyValue;
  readonly id: string;

  constructor(view: IView, values: AnyValue) {
    this.values = values;
    this.view = view;
    this.instance = null;
    this.id = v4();
  }

  setValues(values: AnyValue) {
    this.values = values;
  }

  getValues() {
    return this.values;
  }

  compile() {
    this.instance = this.view.data(this.values).id(this.id);
    return this.instance;
  }
}
