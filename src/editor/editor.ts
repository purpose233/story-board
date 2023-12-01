import type { InteractionEventHandler, IView } from '@visactor/vgrammar';
import { View } from '@visactor/vgrammar';
import { TextMark } from './marks/text';
import { GroupMark } from './marks/group';
import type {
  ArcMarkVisual,
  AreaMarkVisual,
  GroupMarkVisual,
  LineMarkVisual,
  PolygonMarkVisual,
  RectMarkVisual,
  ShapeMarkVisual
} from '../typings/mark';
import { type CommonMarkSpec, type CommonMark, MarkType } from '../typings/mark';
import { Interaction } from './interaction/interaction';
import { isString } from '@visactor/vutils';
import { RectMark } from './marks/rect';
import { CircleMark } from './marks/circle';
import { ArcMark } from './marks/arc';
import { AreaMark } from './marks/area';
import { ShapeMark } from './marks/shape';
import { SymbolMark } from './marks/symbol';
import { LineMark } from './marks/line';
import { PolygonlMark } from './marks/polygon';
import type { ScaleSpec } from './scales/base';
import { Scale } from './scales/base';
import { Data } from './data/base';

export interface EditorConfig {
  container: string | HTMLElement;
}

export const createMarkByType = (type: string, view: IView, config: CommonMarkSpec): CommonMark => {
  switch (type) {
    case MarkType.text:
      return new TextMark(view, config);
    case MarkType.group:
      return new GroupMark(view, config as GroupMarkVisual);
    case MarkType.rect:
      return new RectMark(view, config as RectMarkVisual);
    case MarkType.circle:
      return new CircleMark(view, config);
    case MarkType.arc:
      return new ArcMark(view, config as ArcMarkVisual);
    case MarkType.line:
      return new LineMark(view, config as LineMarkVisual);
    case MarkType.area:
      return new AreaMark(view, config as AreaMarkVisual);
    case MarkType.shape:
      return new ShapeMark(view, config as ShapeMarkVisual);
    case MarkType.symbol:
      return new SymbolMark(view, config as ShapeMarkVisual);
    case MarkType.polygon:
      return new PolygonlMark(view, config as PolygonMarkVisual);
    default:
      throw `mark type ${type} 不存在`;
  }
};
export class Editor {
  private config: EditorConfig;
  private view!: IView;
  private layers: never[];
  private interaction: Interaction;
  private root: GroupMark | null;
  private markMap: Map<string, CommonMark>;
  scales: Scale[];
  dataList: Data[];

  constructor(config: EditorConfig) {
    this.config = config;
    this.interaction = new Interaction(this);
    this.layers = [];
    this.markMap = new Map();
    this.scales = [];
    this.root = null;
    this.dataList = [];
  }

  init() {
    const { container, ...otherConfig } = this.config;
    this.view = new View({
      width: 500,
      height: 500,
      container: container,
      logLevel: 3,
      ...otherConfig
    });
    // @ts-ignore
    window.view = this.view;
    this.interaction.init();
    this.root = new GroupMark(this.view);
    this.markMap.set(this.root.id, this.root);
  }

  createElement(type: string, config: CommonMarkSpec = {}, groupId?: string) {
    const mark = createMarkByType(type, this.view, config);
    mark.init();
    this.markMap.set(mark.id, mark);
    if (groupId) {
      const groupMark = this.markMap.get(groupId) as GroupMark;
      this.add(mark, groupMark);
    } else {
      this.add(mark, this.root!);
    }
    return mark.id;
  }

  add(element: CommonMark, groupMark = this.root!) {
    groupMark.addElement(element);
  }

  move(originMarkId: string, groupId: string = this.root!.id, position = 0) {
    const fromMark = this.getElementById(originMarkId)!;
    const groupMark = this.getElementById(groupId) as GroupMark;
    // if elements are in the same group, swap them
    if (fromMark?.group === groupMark) {
      groupMark.swapElement(fromMark.id, groupMark.getElementByIndex(position)!.id);
      return;
    }
    // otherwise remove group first
    fromMark.removeGroup();
    groupMark.addElement(fromMark, position);
  }

  delete(id: string) {
    const mark = this.markMap.get(id);
    if (!mark) {
      return;
    }
    this.markMap.delete(id);
    mark.destory();
  }

  getElementById(id: string) {
    const mark = this.markMap.get(id);
    if (mark) {
      return mark;
    }
    return null;
  }

  getViewElementById(id: string) {
    const mark = this.markMap.get(id);
    if (mark) {
      return mark.getViewElement();
    }
    return null;
  }

  getViewElements() {
    return this.getElements().map(el => el.getViewElement());
  }

  getRootMark() {
    return this.root;
  }

  getContainer(): HTMLElement {
    return isString(this.config.container) ? document.getElementById(this.config.container)! : this.config.container;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createData(values: any[]) {
    const data = new Data(this.view, values);
    this.dataList.push(data);
    return data;
  }

  getDataById(id: string) {
    return this.dataList.find(data => data.id === id);
  }

  createScale(spec: ScaleSpec) {
    const scale = new Scale(this.view, spec);
    this.scales.push(scale);
    return scale;
  }

  removeScale(id: string) {
    const index = this.scales.findIndex(scale => scale.id === id);
    if (index !== -1) {
      this.scales.splice(index, 1);
    }
  }

  getScaleById(id: string) {
    return this.scales.find(scale => scale.id === id);
  }

  getViewScales() {
    return this.scales.map(scale => scale.getViewElement());
  }

  getViewScaleById(id: string) {
    return this.scales.find(scale => scale.id === id)?.getViewElement() || null;
  }

  addEventListener(type: string, handler: InteractionEventHandler) {
    this.view.addEventListener(type, handler);
  }

  removeEventListener(type: string, handler: InteractionEventHandler) {
    this.view.removeEventListener(type, handler);
  }

  getElements() {
    return this.root!.marks;
  }

  render() {
    this.view.removeAllGrammars();
    this.view.removeAllInteractions();
    this.view.removeAllGraphicItems();
    const rootGroup = this.view.group(this.view.rootMark).encode(this.root!.getVisuals());
    this.dataList.forEach(data => data.compile());
    this.scales.forEach(scale => scale.compile());
    this.getElements().forEach(element => element.compile(rootGroup));
    this.view.runAsync();
  }

  release() {
    this.view.release();
  }
}
