import type { IVisualConfig } from '../typings';

const merge = (base: IVisualConfig[], visuals: IVisualConfig[]) => {
  const baseMap: Record<string, IVisualConfig> = {};
  base.forEach(config => {
    baseMap[config.channel] = { ...config };
  });
  visuals.forEach(visual => {
    baseMap[visual.channel] = visual;
  });
  return Object.values(baseMap);
};

export const basicVisualConfig: IVisualConfig[] = [
  { channel: 'x', type: 'number', default: 20 },
  { channel: 'y', type: 'number', default: 20 },
  { channel: 'fill', type: 'color', default: '#eff7ff' }
];

const textVisualConfig: IVisualConfig[] = merge(basicVisualConfig, [
  { channel: 'text', type: 'string', default: '文本' },
  { channel: 'fontSize', type: 'number', default: 16 }
]);

const rectVisualConfig: IVisualConfig[] = merge(basicVisualConfig, [
  { channel: 'width', type: 'number', default: 100 },
  { channel: 'height', type: 'number', default: 60 }
]);

const circleVisualConfig: IVisualConfig[] = merge(basicVisualConfig, [
  { channel: 'radius', type: 'number', default: 40 },
  { channel: 'fill', type: 'color', default: 'rgb(201, 111, 209)' },
  { channel: 'stroke', type: 'color', default: 'rgb(201, 111, 209)' },
  { channel: 'fillOpacity', type: 'number', default: 0.5, options: { min: 0, max: 1, step: 0.1 } }
]);

const groupVisualConfig: IVisualConfig[] = merge(basicVisualConfig, [
  { channel: 'fillOpacity', type: 'number', default: 0.1, options: { min: 0, max: 1, step: 0.1 } },
  { channel: 'fill', type: 'color', default: 'red' },
  { channel: 'stroke', type: 'color', default: 'red' },
  { channel: 'width', type: 'number', default: '100' },
  { channel: 'height', type: 'number', default: '100' }
]);

export const elementVisualConfig: Record<string, IVisualConfig[]> = {
  text: textVisualConfig,
  rect: rectVisualConfig,
  group: groupVisualConfig,
  circle: circleVisualConfig
};
