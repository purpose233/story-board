export interface IEditorElementConfig {
  id: string;
  type: "text";
  visuals: Record<string, any>;
}

export interface IVisualConfig {
  channel: string;
  type: "string" | "number" | "color" | "boolean";
  default: any;
  options?: any;
}
