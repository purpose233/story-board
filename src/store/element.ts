import { makeAutoObservable } from "mobx";
import type { IEditorElementConfig } from "../typings";

export class EditorStore {
  currentElement: IEditorElementConfig | null = null;
  elements: IEditorElementConfig[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addElement(element: IEditorElementConfig) {
    this.elements = this.elements.concat(element);
  }
}

export const editorStoreInstance = new EditorStore();
