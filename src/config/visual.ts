import type { IVisualConfig } from "../typings";

const basicVisualConfig: IVisualConfig[] = [
  { channel: "x", type: "number", default: 100 },
  { channel: "y", type: "number", default: 100 },
  { channel: "fill", type: "color", default: "#000000" },
];

const textVisualConfig: IVisualConfig[] = [
  ...basicVisualConfig,
  { channel: "text", type: "string", default: "文本" },
  { channel: "fontSize", type: "number", default: 16 },
];

export const elementVisualConfig: Record<string, IVisualConfig[]> = {
  text: textVisualConfig,
};
