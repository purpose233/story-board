import { makeAutoObservable } from "mobx";
import type { IEditorElementConfig } from "../typings";

export class EditorStore {
  currentElement: IEditorElementConfig | null = null;
  elements: IEditorElementConfig[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addElement(element: IEditorElementConfig) {
    const nextElements = this.elements.concat(element);
    this.elements = nextElements;
  }

  setCurrentElement(id: string | null) {
    const element = this.elements.find((element) => element.id === id);
    this.currentElement = element ?? null;
  }

  updateElement(element: IEditorElementConfig) {
    const nextElements = this.elements.map((lastElement) => {
      return lastElement.id === element.id ? element : lastElement;
    });
    this.elements = nextElements;
  }
}

const editorStoreInstance = new EditorStore();
export const useEditorStore = () => {
  return editorStoreInstance;
};
