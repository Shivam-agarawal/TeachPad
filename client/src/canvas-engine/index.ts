// Canvas engine public API placeholder / skeleton

export interface EngineInstance {
  destroy: () => void;
  resize: (width: number, height: number) => void;
}

export function createEngine(_container: HTMLElement): EngineInstance {
  // Skeleton implementation — no core drawing logic yet
  return {
    destroy: () => {},
    resize: (_w: number, _h: number) => {},
  };
}
