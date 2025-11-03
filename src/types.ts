export interface KeyOSDOptions {
  /** Container element to attach the visualization to. Defaults to document.body */
  container?: HTMLElement;

  /** Whether to capture keyboard events. Defaults to true */
  enabled?: boolean;
}

export interface ModifierStates {
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
  meta: boolean;
}
