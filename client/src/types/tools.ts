// Tool type definitions

export type ToolId =
  | 'pen'
  | 'pencil'
  | 'highlighter'
  | 'eraser'
  | 'laser'
  | 'line'
  | 'arrow'
  | 'rectangle'
  | 'ellipse'
  | 'text'
  | 'image'
  | 'select'
  | 'pan';

export type EraserMode = 'stroke' | 'precision';

export interface ToolState {
  activeToolId: ToolId;
  previousToolId: ToolId | null;
  eraserMode: EraserMode;
}
