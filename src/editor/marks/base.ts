import type { BaseSignleEncodeSpec, IView, IGroupMark } from "@visactor/vgrammar";
import { basicVisualConfig } from '../../config/visual';
import type { GroupMark } from "./group";
import { v4 as uuid } from "uuid";
import type { CommonMark, CommonMarkVisual, MarkVisualKeys } from "../../typings/mark";
import type { IVisualConfig } from "../../typings/index";

export interface ViewElement{
    type: string;
    id: string;
    groupId: string|null;
    visuals: CommonMarkVisual;
    children: ViewElement[];
}

export class BaseMark {
  visuals: CommonMarkVisual
  defaultVisual: IVisualConfig[]
  type: string
  id: string
  visualConfig: CommonMarkVisual
  group: GroupMark | null
  view: IView
  constructor(view: IView, visualConfig: CommonMarkVisual) {
    this.type = 'base'
    this.visuals = {}
    this.id = uuid()
    this.visualConfig = visualConfig
    this.group = null
    this.view = view
    this.defaultVisual = basicVisualConfig
  }

  init() {
    this.initDefaultVisual(this.defaultVisual)
  }

  initDefaultVisual(config: IVisualConfig[]) {
    const visuals: BaseSignleEncodeSpec = {};
    for (const visual of config) {
      visuals[visual.channel] = visual.default;
    }
    this.visuals = {...visuals, ...this.visualConfig}
  }

  addGroup(group: GroupMark) {
    this.group = group
  }

  updateVisuals(channel: keyof CommonMarkVisual, config: CommonMarkVisual) {
    (this.visuals as any)[channel] = config
  }

  getVisuals(): CommonMarkVisual {
    return this.visuals
  }

  getElementById(id: string): CommonMark|null {
    if (this.id === id) {
      return this
    }
    return null
  }

  getViewElementById(id: string): ViewElement|null {
    if (this.id === id) {
      return this.getViewElement()
    }
    return null
  }

  getParentId(): string|undefined {
    return this.group?.id
  }

  getViewElement(): ViewElement {
    return {
      type: this.type,
      id: this.id,
      visuals: this.visuals,
      groupId: this.group?.id
    } as ViewElement
  }

  compile(group: IGroupMark) {
    this.view.mark(this.type, group).encode(this.getVisuals());
  }
}
