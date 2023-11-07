import { makeAutoObservable } from 'mobx';
import type { ViewElement } from '../editor/marks/base';

export class EditorStore {
  currentElement: ViewElement | null = null;
  viewElements: ViewElement[] = [];
  elementMap: Map<string, ViewElement> = new Map();

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
}

const editorStoreInstance = new EditorStore();
export const useEditorStore = () => {
  return editorStoreInstance;
};
