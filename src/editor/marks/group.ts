import type { IGroupMark, IView } from '@visactor/vgrammar';
import { BaseMark, type ViewElement } from './base';
import { elementVisualConfig } from '../../config/visual';
import { MarkType, type CommonMark, type GroupMarkVisual } from '../../typings/mark';

export class GroupMark extends BaseMark {
  readonly type: MarkType.group;
  marks: CommonMark[];
  constructor(view: IView, visualConfig: GroupMarkVisual = {}) {
    super(view, visualConfig);
    this.type = MarkType.group;
    this.marks = [];
    this.defaultVisual = elementVisualConfig.group;
  }

  getViewElement(): ViewElement {
    const element = {
      type: this.type,
      id: this.id,
      groupId: this.group?.id ?? null,
      visuals: this.visuals,
      children: this.marks.map(mark => mark.getViewElement())
    } as ViewElement;
    return element;
  }

  addElement(element: CommonMark, index?: number) {
    if (typeof index === 'number' && index < this.marks.length) {
      this.marks.splice(index, 0, element);
    } else {
      this.marks.push(element);
    }
    element.addGroup(this);
  }

  swapElement(id1: string, id2: string) {
    const index1 = this.marks.findIndex(mark => mark.id === id1);
    const index2 = this.marks.findIndex(mark => mark.id === id2);
    const mark1 = this.marks[index1];
    this.marks[index1] = this.marks[index2];
    this.marks[index2] = mark1;
  }

  removeElement(element: CommonMark | string) {
    let index: number;
    // FIXME: change to common function
    if (typeof element === 'string') {
      index = this.marks.findIndex(mark => mark.id === element);
    } else {
      index = this.marks.findIndex(mark => mark === element);
    }
    if (index === -1) {
      return;
    }
    const mark = this.marks[index];
    mark.group = null;
    this.marks.splice(index, 1);
  }

  getIndexByElementId(id: string): number {
    return this.marks.findIndex(mark => mark.id === id);
  }

  getElementByIndex(index: number): CommonMark | null {
    return this.marks[index] ?? null;
  }

  getElementById(id: string): CommonMark | null {
    if (this.id === id) {
      return this;
    }
    return (
      this.marks.find(mark => {
        if (mark.type !== MarkType.group) {
          return mark.getElementById(id);
        }
        return mark.id === id;
      }) ?? null
    );
  }
  getViewElementById(id: string): ViewElement | null {
    return this.marks.find(mark => mark.getViewElementById(id))?.getViewElementById(id) ?? null;
  }

  compile(group: IGroupMark) {
    const curGroup = this.view.group(group).encode(this.getVisuals());
    this.marks.forEach(mark => mark.compile(curGroup));
  }
}
