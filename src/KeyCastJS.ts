import type { KeyCastOptions, KeyPress } from './types';
import './styles.css';

export class KeyCastJS {
  private container: HTMLElement;
  private overlay: HTMLElement;
  private keysContainer: HTMLElement;
  private keyPresses: KeyPress[] = [];
  private options: Required<KeyCastOptions>;
  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };
  private boundKeyDownHandler: (e: KeyboardEvent) => void;
  private boundMouseDownHandler: (e: MouseEvent) => void;
  private boundMouseMoveHandler: (e: MouseEvent) => void;
  private boundMouseUpHandler: () => void;
  private boundTouchStartHandler: (e: TouchEvent) => void;
  private boundTouchMoveHandler: (e: TouchEvent) => void;
  private boundTouchEndHandler: () => void;

  constructor(options: KeyCastOptions = {}) {
    this.options = {
      container: options.container || document.body,
      x: options.x ?? -1,
      y: options.y ?? -1,
      displayDuration: options.displayDuration ?? 2000,
      maxKeys: options.maxKeys ?? 5,
      enabled: options.enabled ?? true,
    };

    this.container = this.options.container;
    this.overlay = this.createOverlay();
    this.keysContainer = this.createKeysContainer();

    this.boundKeyDownHandler = this.handleKeyDown.bind(this);
    this.boundMouseDownHandler = this.handleMouseDown.bind(this);
    this.boundMouseMoveHandler = this.handleMouseMove.bind(this);
    this.boundMouseUpHandler = this.handleMouseUp.bind(this);
    this.boundTouchStartHandler = this.handleTouchStart.bind(this);
    this.boundTouchMoveHandler = this.handleTouchMove.bind(this);
    this.boundTouchEndHandler = this.handleTouchEnd.bind(this);

    this.init();
  }

  private createOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'keycastjs-overlay';
    return overlay;
  }

  private createKeysContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'keycastjs-keys';
    return container;
  }

  private init(): void {
    this.overlay.appendChild(this.keysContainer);
    this.container.appendChild(this.overlay);

    // Set initial position
    if (this.options.x === -1 || this.options.y === -1) {
      // Default to bottom-center
      this.setPosition(
        window.innerWidth / 2,
        window.innerHeight - 150
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
  }

  private setPosition(x: number, y: number): void {
    this.overlay.style.left = `${x}px`;
    this.overlay.style.top = `${y}px`;
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // Ignore if key is already being displayed (key repeat)
    if (e.repeat) return;

    const modifiers: string[] = [];
    if (e.metaKey) modifiers.push('⌘');
    if (e.ctrlKey) modifiers.push('⌃');
    if (e.altKey) modifiers.push('⌥');
    if (e.shiftKey) modifiers.push('⇧');

    let key = e.key;

    // Normalize key names
    switch (key) {
      case ' ':
        key = 'Space';
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

    const keyPress: KeyPress = {
      id: `${Date.now()}-${Math.random()}`,
      key: key.length === 1 ? key.toUpperCase() : key,
      modifiers,
      timestamp: Date.now(),
    };

    this.addKeyPress(keyPress);
  }

  private addKeyPress(keyPress: KeyPress): void {
    this.keyPresses.push(keyPress);

    // Limit the number of displayed keys
    if (this.keyPresses.length > this.options.maxKeys) {
      const removed = this.keyPresses.shift();
      if (removed) {
        const element = document.getElementById(removed.id);
        element?.remove();
      }
    }

    this.renderKeyPress(keyPress);

    // Auto-remove after duration
    setTimeout(() => {
      this.removeKeyPress(keyPress.id);
    }, this.options.displayDuration);
  }

  private renderKeyPress(keyPress: KeyPress): void {
    const keyElement = document.createElement('div');
    keyElement.id = keyPress.id;
    keyElement.className = 'keycastjs-key';

    if (keyPress.modifiers.length > 0) {
      const modifiersSpan = document.createElement('span');
      modifiersSpan.className = 'keycastjs-modifiers';
      modifiersSpan.textContent = keyPress.modifiers.join(' ');
      keyElement.appendChild(modifiersSpan);
    }

    const keySpan = document.createElement('span');
    keySpan.className = 'keycastjs-main-key';
    keySpan.textContent = keyPress.key;
    keyElement.appendChild(keySpan);

    this.keysContainer.appendChild(keyElement);

    // Trigger animation
    requestAnimationFrame(() => {
      keyElement.classList.add('keycastjs-key-visible');
    });
  }

  private removeKeyPress(id: string): void {
    const index = this.keyPresses.findIndex((kp) => kp.id === id);
    if (index !== -1) {
      this.keyPresses.splice(index, 1);
    }

    const element = document.getElementById(id);
    if (element) {
      element.classList.add('keycastjs-key-hidden');
      setTimeout(() => {
        element.remove();
      }, 300); // Match fade out animation
    }
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
  }

  public disable(): void {
    this.options.enabled = false;
    document.removeEventListener('keydown', this.boundKeyDownHandler);
  }

  public destroy(): void {
    this.disable();
    this.overlay.removeEventListener('mousedown', this.boundMouseDownHandler);
    this.overlay.removeEventListener('touchstart', this.boundTouchStartHandler);
    document.removeEventListener('mousemove', this.boundMouseMoveHandler);
    document.removeEventListener('mouseup', this.boundMouseUpHandler);
    document.removeEventListener('touchmove', this.boundTouchMoveHandler);
    document.removeEventListener('touchend', this.boundTouchEndHandler);
    this.overlay.remove();
  }

  public clear(): void {
    this.keyPresses = [];
    this.keysContainer.innerHTML = '';
  }
}
