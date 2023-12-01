import type { BaseSignleEncodeSpec, IView, IGroupMark, IMark, ChannelEncodeType } from '@visactor/vgrammar';
import { basicVisualConfig } from '../../config/visual';
import type { GroupMark } from './group';
import { v4 as uuid } from 'uuid';
import type { CommonMark, CommonMarkVisual } from '../../typings/mark';
import type { IVisualConfig } from '../../typings/index';
import type { Data } from '../data/base';
import type { Scale, ScaleViewElement } from '../scales/base';

export interface ViewElement {
  type: string;
  id: string;
  groupId: string | null;
  visuals: CommonMarkVisual;
  children: ViewElement[];
  scaleViewElements: ScaleViewElements;
}

export interface ScaleInfo extends ScaleViewElement {
  scale: Scale;
  channel: string;
}

export type ScaleViewInfo = Omit<ScaleInfo, 'scale'>;

export type ScaleViewElements = Record<string, ScaleViewInfo>;

export abstract class BaseMark {
  readonly type: string;
  readonly id: string;

  visuals: CommonMarkVisual;
  defaultVisual: IVisualConfig[];
  visualConfig: CommonMarkVisual;
  group: GroupMark | null;
  view: IView;
  mark: IMark | null;
  data: Data | null;
  scaleInfos: ScaleInfo[];

  constructor(view: IView, visualConfig: CommonMarkVisual) {
    this.type = 'base';
    this.id = uuid();
    this.visuals = {};
    this.visualConfig = visualConfig;
    this.group = null;
    this.view = view;
    this.mark = null;
    this.data = null;
    this.scaleInfos = [];
    this.defaultVisual = basicVisualConfig;
  }

  init() {
    this.initDefaultVisual(this.defaultVisual);
  }

  initDefaultVisual(config: IVisualConfig[]) {
    const visuals: BaseSignleEncodeSpec = {};
    for (const visual of config) {
      visuals[visual.channel] = visual.default;
    }
    this.visuals = { ...visuals, ...this.visualConfig };
  }

  addGroup(group: GroupMark) {
    this.group = group;
  }

  removeGroup() {
    this.group?.removeElement(this);
  }

  updateVisuals(channel: keyof CommonMarkVisual, config: CommonMarkVisual) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.visuals as any)[channel] = config;
  }

  getVisuals(): CommonMarkVisual {
    return this.visuals;
  }

  getElementById(id: string): CommonMark | null {
    if (this.id === id) {
      return this;
    }
    return null;
  }

  getIndex(): number {
    return this.group?.getIndexByElementId(this.id) ?? -1;
  }

  getViewElementById(id: string): ViewElement | null {
    if (this.id === id) {
      return this.getViewElement();
    }
    return null;
  }

  getParentId(): string | undefined {
    return this.group?.id;
  }

  getViewElement(): ViewElement {
    const scaleViewElementsMap: Record<string, ScaleViewInfo> = {};
    this.scaleInfos.forEach(({ scale, channel, ...spec }) => {
      const viewInfo = scale.getViewElement();
      scaleViewElementsMap[channel] = {
        channel,
        ...spec,
        ...viewInfo
      };
    });
    return {
      type: this.type,
      id: this.id,
      visuals: this.visuals,
      groupId: this.group?.id,
      scaleViewElements: scaleViewElementsMap
    } as ViewElement;
  }

  compile(group: IGroupMark): IMark {
    this.mark = this.view.mark(this.type, group).encode(this.getVisuals());
    if (this.data) {
      this.mark.join(this.data.id);
    }

    this.scaleInfos.forEach(info => {
      const { scale } = info;
      this.mark!.encode(info.channel, {
        scale: scale.id,
        field: scale.field
      });
    });

    // FIXME: waiting for vgrammar to provide context api
    // eslint-disable-next-line
    (this.mark as any).viewContext = {
      id: this.id
    };
    return this.mark;
  }

  bindData(data: Data) {
    this.data = data;
  }

  bindScale(channel: string, scale: Scale, spec: ChannelEncodeType) {
    if (!this.scaleInfos.find(info => info.scale.id === scale.id && info.channel === channel)) {
      this.scaleInfos.push({
        scale,
        channel,
        ...spec
      });
    }
  }

  removeScale(id: string, channel: string) {
    const index = this.scaleInfos.findIndex(info => info.scale.id === id && info.channel === channel);
    if (index !== -1) {
      this.scaleInfos.splice(index, 1);
    }
  }

  removeScaleByChannel(channel: string) {
    const index = this.scaleInfos.findIndex(info => info.channel === channel);
    if (index !== -1) {
      this.scaleInfos.splice(index, 1);
    }
  }

  release() {
    if (this.mark) {
      this.view.removeGrammar(this.mark);
    }
  }

  destory() {
    this.removeGroup();
  }
}
