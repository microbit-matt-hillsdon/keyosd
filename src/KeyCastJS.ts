import type { KeyCastOptions, ModifierStates } from './types';
import './styles.css';

export class KeyCastJS {
  private container: HTMLElement;
  private overlay: HTMLElement;
  private displayArea: HTMLElement;
  private modifiersArea: HTMLElement;
  private keyBuffer: string[] = [];
  private modifierStates: ModifierStates = {
    shift: false,
    ctrl: false,
    alt: false,
    meta: false,
  };
  private options: Required<KeyCastOptions>;
  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };
  private boundKeyDownHandler: (e: KeyboardEvent) => void;
  private boundKeyUpHandler: (e: KeyboardEvent) => void;
  private boundMouseDownHandler: (e: MouseEvent) => void;
  private boundMouseMoveHandler: (e: MouseEvent) => void;
  private boundMouseUpHandler: () => void;
  private boundTouchStartHandler: (e: TouchEvent) => void;
  private boundTouchMoveHandler: (e: TouchEvent) => void;
  private boundTouchEndHandler: () => void;
  private boundResizeHandler: () => void;

  constructor(options: KeyCastOptions = {}) {
    this.options = {
      container: options.container || document.body,
      x: options.x ?? -1,
      y: options.y ?? -1,
      enabled: options.enabled ?? true,
    };

    this.container = this.options.container;
    this.overlay = this.createOverlay();
    this.displayArea = this.createDisplayArea();
    this.modifiersArea = this.createModifiersArea();

    this.boundKeyDownHandler = this.handleKeyDown.bind(this);
    this.boundKeyUpHandler = this.handleKeyUp.bind(this);
    this.boundMouseDownHandler = this.handleMouseDown.bind(this);
    this.boundMouseMoveHandler = this.handleMouseMove.bind(this);
    this.boundMouseUpHandler = this.handleMouseUp.bind(this);
    this.boundTouchStartHandler = this.handleTouchStart.bind(this);
    this.boundTouchMoveHandler = this.handleTouchMove.bind(this);
    this.boundTouchEndHandler = this.handleTouchEnd.bind(this);
    this.boundResizeHandler = this.handleResize.bind(this);

    this.init();
  }

  private createOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'keycastjs-overlay';
    return overlay;
  }

  private createDisplayArea(): HTMLElement {
    const display = document.createElement('div');
    display.className = 'keycastjs-display';
    return display;
  }

  private createModifiersArea(): HTMLElement {
    const modifiers = document.createElement('div');
    modifiers.className = 'keycastjs-modifiers-area';

    const modifierKeys = [
      { key: 'shift', symbol: '⇧' },
      { key: 'ctrl', symbol: '⌃' },
      { key: 'alt', symbol: '⌥' },
      { key: 'meta', symbol: '⌘' },
    ];

    modifierKeys.forEach(({ key, symbol }) => {
      const mod = document.createElement('div');
      mod.className = 'keycastjs-modifier';
      mod.dataset.modifier = key;
      mod.textContent = symbol;
      modifiers.appendChild(mod);
    });

    return modifiers;
  }

  private init(): void {
    this.overlay.appendChild(this.displayArea);
    this.overlay.appendChild(this.modifiersArea);
    this.container.appendChild(this.overlay);

    // Set initial position
    if (this.options.x === -1 || this.options.y === -1) {
      // Default to bottom-right with 1rem inset
      const inset = 16; // 1rem = 16px
      this.setPosition(
        window.innerWidth - inset - 100, // 100px is half the overlay width (200px)
        window.innerHeight - inset - 50  // 50px is half the overlay height (~100px)
      );
    } else {
      this.setPosition(this.options.x, this.options.y);
    }

    // Add event listeners
    if (this.options.enabled) {
      this.enable();
    }

    this.overlay.addEventListener('mousedown', this.boundMouseDownHandler);
    this.overlay.addEventListener('touchstart', this.boundTouchStartHandler, { passive: false });
    window.addEventListener('resize', this.boundResizeHandler);
  }

  private setPosition(x: number, y: number): void {
    const constrained = this.constrainPosition(x, y);
    this.overlay.style.left = `${constrained.x}px`;
    this.overlay.style.top = `${constrained.y}px`;
  }

  private constrainPosition(x: number, y: number): { x: number; y: number } {
    // Get overlay dimensions (200px width, ~100px height)
    const overlayWidth = 200;
    const overlayHeight = 100;

    // Calculate bounds considering the transform translate(-50%, -50%)
    const minX = overlayWidth / 2;
    const maxX = window.innerWidth - overlayWidth / 2;
    const minY = overlayHeight / 2;
    const maxY = window.innerHeight - overlayHeight / 2;

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y))
    };
  }

  private handleResize(): void {
    // Re-constrain position on window resize
    const currentLeft = parseFloat(this.overlay.style.left) || 0;
    const currentTop = parseFloat(this.overlay.style.top) || 0;
    this.setPosition(currentLeft, currentTop);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // Check if modifier state changed
    const prevShift = this.modifierStates.shift;
    const prevCtrl = this.modifierStates.ctrl;
    const prevAlt = this.modifierStates.alt;
    const prevMeta = this.modifierStates.meta;

    // Update modifier states
    this.modifierStates.shift = e.shiftKey;
    this.modifierStates.ctrl = e.ctrlKey;
    this.modifierStates.alt = e.altKey;
    this.modifierStates.meta = e.metaKey;

    // Clear display if any modifier state changed
    if (prevShift !== e.shiftKey || prevCtrl !== e.ctrlKey ||
        prevAlt !== e.altKey || prevMeta !== e.metaKey) {
      this.clear();
    }

    this.updateModifierDisplay();

    // Ignore key repeats
    if (e.repeat) return;

    let key = e.key;

    // Normalize key names
    switch (key) {
      case ' ':
        key = '␣';
        break;
      case 'ArrowUp':
        key = '↑';
        break;
      case 'ArrowDown':
        key = '↓';
        break;
      case 'ArrowLeft':
        key = '←';
        break;
      case 'ArrowRight':
        key = '→';
        break;
      case 'Enter':
        key = '↵';
        break;
      case 'Backspace':
        key = '⌫';
        break;
      case 'Delete':
        key = '⌦';
        break;
      case 'Escape':
        key = '⎋';
        break;
      case 'Tab':
        key = '⇥';
        break;
    }

    // Don't display modifier keys by themselves
    if (['Meta', 'Control', 'Alt', 'Shift'].includes(key)) {
      return;
    }

    // Build the display string with modifiers
    let displayStr = '';
    const hasModifier = e.metaKey || e.ctrlKey || e.altKey;

    if (e.metaKey) displayStr += '⌘ ';
    if (e.ctrlKey) displayStr += '⌃ ';
    if (e.altKey) displayStr += '⌥ ';
    if (e.shiftKey) displayStr += '⇧ ';

    // Uppercase single-character keys when used with modifiers (not shift alone)
    if (hasModifier && key.length === 1) {
      displayStr += key.toUpperCase();
    } else {
      displayStr += key;
    }

    this.addToBuffer(displayStr);
  }

  private handleKeyUp(e: KeyboardEvent): void {
    // Check if modifier state changed
    const prevShift = this.modifierStates.shift;
    const prevCtrl = this.modifierStates.ctrl;
    const prevAlt = this.modifierStates.alt;
    const prevMeta = this.modifierStates.meta;

    // Update modifier states
    this.modifierStates.shift = e.shiftKey;
    this.modifierStates.ctrl = e.ctrlKey;
    this.modifierStates.alt = e.altKey;
    this.modifierStates.meta = e.metaKey;

    // Clear display if any modifier state changed
    if (prevShift !== e.shiftKey || prevCtrl !== e.ctrlKey ||
        prevAlt !== e.altKey || prevMeta !== e.metaKey) {
      this.clear();
    }

    this.updateModifierDisplay();
  }

  private addToBuffer(str: string): void {
    // Add to buffer
    this.keyBuffer.push(str);

    // Keep only last 6 items
    if (this.keyBuffer.length > 6) {
      this.keyBuffer.shift();
    }

    this.render();
  }

  private render(): void {
    const content = this.keyBuffer.join(' ');
    this.displayArea.textContent = content;

    // Dynamic font sizing based on content length for 200px width
    const length = content.length;
    let fontSize: number;

    if (length <= 2) {
      fontSize = 48;
    } else if (length <= 4) {
      fontSize = 40;
    } else if (length <= 8) {
      fontSize = 32;
    } else if (length <= 12) {
      fontSize = 26;
    } else if (length <= 20) {
      fontSize = 20;
    } else if (length <= 30) {
      fontSize = 16;
    } else {
      fontSize = 14;
    }

    this.displayArea.style.fontSize = `${fontSize}px`;
  }

  private updateModifierDisplay(): void {
    const modifiers = this.modifiersArea.querySelectorAll('.keycastjs-modifier');
    modifiers.forEach((mod) => {
      const modifierKey = (mod as HTMLElement).dataset.modifier as keyof ModifierStates;
      if (this.modifierStates[modifierKey]) {
        mod.classList.add('keycastjs-modifier-active');
      } else {
        mod.classList.remove('keycastjs-modifier-active');
      }
    });
  }

  private handleMouseDown(e: MouseEvent): void {
    if (e.button !== 0) return; // Only left click

    this.isDragging = true;
    const currentLeft = parseFloat(this.overlay.style.left) || 0;
    const currentTop = parseFloat(this.overlay.style.top) || 0;
    this.dragOffset.x = e.clientX - currentLeft;
    this.dragOffset.y = e.clientY - currentTop;

    this.overlay.classList.add('keycastjs-dragging');

    document.addEventListener('mousemove', this.boundMouseMoveHandler);
    document.addEventListener('mouseup', this.boundMouseUpHandler);

    e.preventDefault();
  }

  private handleMouseMove(e: MouseEvent): void {
    if (!this.isDragging) return;

    const x = e.clientX - this.dragOffset.x;
    const y = e.clientY - this.dragOffset.y;

    this.setPosition(x, y);
  }

  private handleMouseUp(): void {
    this.isDragging = false;
    this.overlay.classList.remove('keycastjs-dragging');

    document.removeEventListener('mousemove', this.boundMouseMoveHandler);
    document.removeEventListener('mouseup', this.boundMouseUpHandler);
  }

  private handleTouchStart(e: TouchEvent): void {
    if (e.touches.length !== 1) return; // Only single touch

    this.isDragging = true;
    const touch = e.touches[0];
    const currentLeft = parseFloat(this.overlay.style.left) || 0;
    const currentTop = parseFloat(this.overlay.style.top) || 0;
    this.dragOffset.x = touch.clientX - currentLeft;
    this.dragOffset.y = touch.clientY - currentTop;

    this.overlay.classList.add('keycastjs-dragging');

    document.addEventListener('touchmove', this.boundTouchMoveHandler, { passive: false });
    document.addEventListener('touchend', this.boundTouchEndHandler);

    e.preventDefault();
  }

  private handleTouchMove(e: TouchEvent): void {
    if (!this.isDragging || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const x = touch.clientX - this.dragOffset.x;
    const y = touch.clientY - this.dragOffset.y;

    this.setPosition(x, y);
    e.preventDefault();
  }

  private handleTouchEnd(): void {
    this.isDragging = false;
    this.overlay.classList.remove('keycastjs-dragging');

    document.removeEventListener('touchmove', this.boundTouchMoveHandler);
    document.removeEventListener('touchend', this.boundTouchEndHandler);
  }

  public enable(): void {
    this.options.enabled = true;
    document.addEventListener('keydown', this.boundKeyDownHandler);
    document.addEventListener('keyup', this.boundKeyUpHandler);
  }

  public disable(): void {
    this.options.enabled = false;
    document.removeEventListener('keydown', this.boundKeyDownHandler);
    document.removeEventListener('keyup', this.boundKeyUpHandler);
  }

  public destroy(): void {
    this.disable();
    this.overlay.removeEventListener('mousedown', this.boundMouseDownHandler);
    this.overlay.removeEventListener('touchstart', this.boundTouchStartHandler);
    document.removeEventListener('mousemove', this.boundMouseMoveHandler);
    document.removeEventListener('mouseup', this.boundMouseUpHandler);
    document.removeEventListener('touchmove', this.boundTouchMoveHandler);
    document.removeEventListener('touchend', this.boundTouchEndHandler);
    window.removeEventListener('resize', this.boundResizeHandler);
    this.overlay.remove();
  }

  public clear(): void {
    this.keyBuffer = [];
    this.displayArea.textContent = '';
  }
}
