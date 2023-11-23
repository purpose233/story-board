import type { IVisualConfig } from '../typings';
import type { CommonMarkVisual } from '../typings/mark';

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

const types = [
  'circle',
  'cross',
  'diamond',
  'square',
  'arrow',
  'arrow2Left',
  'arrow2Right',
  'wedge',
  'thinTriangle',
  'triangle',
  'triangleUp',
  'triangleDown',
  'triangleRight',
  'triangleLeft',
  'stroke',
  'star',
  'wye',
  'rect'
];
const symbolTypeOptions = types.map(type => ({ value: type, label: type }));

export const basicVisualConfig: IVisualConfig[] = [
  { channel: 'x', type: 'number', default: 20 },
  { channel: 'y', type: 'number', default: 20 },
  { channel: 'fill', type: 'color', default: '#eff7ff' }
];

const textVisualConfig: IVisualConfig[] = merge(basicVisualConfig, [
  { channel: 'text', type: 'string', default: '文本' },
  { channel: 'fontSize', type: 'number', default: 16 },
  { channel: 'fill', type: 'color', default: '#222' }
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

const arcVisualConfig: IVisualConfig[] = merge(basicVisualConfig, [
  { channel: 'startAngle', type: 'angle', default: 0 },
  { channel: 'endAngle', type: 'angle', default: 90 },
  { channel: 'innerRadius', type: 'number', default: 0 },
  { channel: 'outerRadius', type: 'number', default: 40 },
  { channel: 'fill', type: 'color', default: 'rgb(201, 111, 209)' },
  { channel: 'stroke', type: 'color', default: 'rgb(201, 111, 209)' },
  { channel: 'fillOpacity', type: 'number', default: 0.5, options: { min: 0, max: 1, step: 0.1 } }
]);

const areaVisualConfig: IVisualConfig[] = merge(basicVisualConfig, [
  { channel: 'x1', type: 'number', default: 20 },
  { channel: 'y1', type: 'number', default: 20 },
  { channel: 'fill', type: 'color', default: 'rgb(201, 111, 209)' },
  { channel: 'stroke', type: 'color', default: 'rgb(201, 111, 209)' },
  { channel: 'fillOpacity', type: 'number', default: 0.5, options: { min: 0, max: 1, step: 0.1 } }
]);

const polygonVisualConfig: IVisualConfig[] = merge(basicVisualConfig, [
  {
    channel: 'points',
    type: 'points',
    default: [
      { x: 0, y: 0 },
      { x: 30, y: 0 },
      { x: 40, y: 30 },
      { x: -10, y: 30 }
    ]
  },
  { channel: 'fill', type: 'color', default: 'rgb(201, 111, 209)' },
  { channel: 'stroke', type: 'color', default: 'rgb(201, 111, 209)' },
  { channel: 'fillOpacity', type: 'number', default: 0.5, options: { min: 0, max: 1, step: 0.1 } }
]);

const lineVisualConfig: IVisualConfig[] = merge(basicVisualConfig, [
  { channel: 'stroke', type: 'color', default: 'rgb(201, 111, 209)' }
]);

const shapeVisualConfig: IVisualConfig[] = merge(basicVisualConfig, [
  { channel: 'stroke', type: 'color', default: 'rgb(201, 111, 209)' },
  { channel: 'fillOpacity', type: 'number', default: 0.5, options: { min: 0, max: 1, step: 0.1 } }
]);

const symbolVisualConfig: IVisualConfig[] = merge(basicVisualConfig, [
  // 'circle' | 'cross' | 'diamond' | 'square' | 'arrow' | 'arrow2Left' | 'arrow2Right' | 'wedge' | 'thinTriangle' | 'triangle' | 'triangleUp' | 'triangleDown' | 'triangleRight' | 'triangleLeft' | 'stroke' | 'star' | 'wye' | 'rect'
  { channel: 'shape', type: 'select', default: 'diamond', options: { options: symbolTypeOptions } },
  { channel: 'size', type: 'number', default: 20 },
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
  circle: circleVisualConfig,
  arc: arcVisualConfig,
  line: lineVisualConfig,
  area: areaVisualConfig,
  shape: shapeVisualConfig,
  symbol: symbolVisualConfig,
  polygon: polygonVisualConfig
};

// get mark default visual
export const getDefaultVisual = (type: keyof typeof elementVisualConfig) => {
  const config = elementVisualConfig[type];
  if (!config) {
    return {};
  }
  const visual = config.reduce((acc, cur) => {
    if (cur.type === 'angle') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (acc as any)[cur.channel] = (cur.default as number) * (Math.PI / 180);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (acc as any)[cur.channel] = cur.default;
    }
    return acc;
  }, {} as CommonMarkVisual);

  return visual;
};
