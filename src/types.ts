export interface KeyCastOptions {
  /** Container element to attach the visualization to. Defaults to document.body */
  container?: HTMLElement;

  /** Initial X position of the visualization. Defaults to bottom-center */
  x?: number;

  /** Initial Y position of the visualization. Defaults to bottom-center */
  y?: number;

  /** Duration in ms to display each keystroke. Defaults to 2000 */
  displayDuration?: number;

  /** Maximum number of keystrokes to show at once. Defaults to 5 */
  maxKeys?: number;

  /** Whether to capture keyboard events. Defaults to true */
  enabled?: boolean;
}

export interface KeyPress {
  id: string;
  key: string;
  modifiers: string[];
  timestamp: number;
}
