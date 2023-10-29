export interface IEditorElementConfig {
  id: string;
  type: "text";
  position: { x: number; y: number };
  visuals: Record<string, any>;
}
