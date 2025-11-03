# KeyCastJS

A minimalist TypeScript library for displaying keystrokes like the Mac app KeyCastr with the Svelte visualizer mode.

## Features

- KeyCastr Svelte mode visualization
- Fixed 200×100px compact display
- Displays up to 6 characters with dynamic font sizing
- Keystrokes persist and show the most recent input
- Display clears automatically when modifier keys are pressed/released
- Persistent modifier key indicators (⇧ ⌃ ⌥ ⌘)
- Modifiers shown in both the display area and as hold state indicators
- Positioned in bottom-right by default (1rem inset)
- Fixed positioning - stays visible when scrolling
- Automatic bounds checking - never moves out of viewport
- Draggable display that can be moved with mouse or touch
- Touch device support (mobile and tablet)
- Text starts large and shrinks to fit as more characters appear
- Minimal padding and no width changes
- No UI framework dependencies
- Zero ARIA attributes to avoid screen reader interference
- TypeScript support with full type definitions

## Installation

```bash
npm install keycastjs
```

## Usage

### Basic Example

```typescript
import { KeyCastJS } from 'keycastjs';

// Initialize with default options
const keyCast = new KeyCastJS();
```

### With Options

```typescript
import { KeyCastJS } from 'keycastjs';

const keyCast = new KeyCastJS({
  container: document.body,       // Container element (default: document.body)
  x: 960,                         // Initial X position (default: bottom-right)
  y: 800,                         // Initial Y position (default: bottom-right)
  enabled: true,                  // Start capturing immediately (default: true)
});
```

## API

### Constructor

```typescript
new KeyCastJS(options?: KeyCastOptions)
```

### Methods

#### `enable()`
Start capturing keyboard events.

```typescript
keyCast.enable();
```

#### `disable()`
Stop capturing keyboard events.

```typescript
keyCast.disable();
```

#### `clear()`
Clear all currently displayed keystrokes.

```typescript
keyCast.clear();
```

#### `destroy()`
Remove the visualization and clean up all event listeners.

```typescript
keyCast.destroy();
```

## Options

```typescript
interface KeyCastOptions {
  container?: HTMLElement;    // Container element (default: document.body)
  x?: number;                 // Initial X position (default: bottom-right, 1rem inset)
  y?: number;                 // Initial Y position (default: bottom-right, 1rem inset)
  enabled?: boolean;          // Start enabled (default: true)
}
```

## Positioning

- **Default position:** Bottom-right corner with 1rem (16px) inset
- **Fixed positioning:** Stays visible when scrolling
- **Bounds checking:** Automatically constrains position within viewport on window resize
- **Draggable:** Click and drag to reposition anywhere on screen

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build
```

## License

MIT
