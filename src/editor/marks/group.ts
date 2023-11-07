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
  addElement(element: CommonMark) {
    this.marks.push(element);
    element.addGroup(this);
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
