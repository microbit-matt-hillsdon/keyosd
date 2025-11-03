export interface KeyCastOptions {
  /** Container element to attach the visualization to. Defaults to document.body */
  container?: HTMLElement;

  /** Initial X position of the visualization. Defaults to bottom-center */
  x?: number;

  /** Initial Y position of the visualization. Defaults to bottom-center */
  y?: number;

  /** Whether to capture keyboard events. Defaults to true */
  enabled?: boolean;
}

export interface ModifierStates {
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
  meta: boolean;
}
