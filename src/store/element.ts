import { makeAutoObservable } from 'mobx';
import type { ViewElement } from '../editor/marks/base';
import { MarkType } from '../typings/mark';
import type { OperationType } from '../typings/editor';
import type { DataElement } from '../view/data-panel';
import type { ScaleViewElement } from '../editor/scales/base';

export class EditorStore {
  currentElement: ViewElement | null = null;
  viewElements: ViewElement[] = [];
  // created scales
  viewScales: ScaleViewElement[] = [];
  elementMap: Map<string, ViewElement> = new Map();
  currentOperationType: OperationType = MarkType.symbol;
  dataElements: DataElement[] = [];
  currentDataElement: DataElement | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  findElementById(id: string): ViewElement | null {
    return this.elementMap.get(id) ?? null;
  }

  addElement(element: ViewElement) {
    this.elementMap.set(element.id, element);
  }

  setCurrentElement(id: string | null) {
    if (!id) {
      this.currentElement = null;
    }
    const element = this.findElementById(id!);
    this.currentElement = element ?? null;
  }

  updateElement(element: ViewElement): ViewElement | void {
    const prevElement = this.elementMap.get(element.id);
    if (!prevElement) {
      throw Error(`id ${element.id} 的元素不存在`);
    }
    this.elementMap.set(element.id, element);
    return element;
  }

  updateViewElements(elements: ViewElement[]) {
    this.viewElements = elements;
  }

  updateViewScales(scales: ScaleViewElement[]) {
    this.viewScales = scales;
  }

  updateCurrentOperationType(type: OperationType) {
    this.currentOperationType = type;
  }

  updateDataElements(dataElements: DataElement[]) {
    this.dataElements = dataElements;
  }

  updateCurrentDataElement(dataElement: DataElement) {
    this.currentDataElement = dataElement;
  }
}

const editorStoreInstance = new EditorStore();
export const useEditorStore = () => {
  return editorStoreInstance;
};
