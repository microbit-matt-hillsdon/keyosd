# KeyCastJS

A minimalist TypeScript library for displaying keystrokes like the Mac app KeyCastr with the Svelte visualizer mode.

## Features

- Clean, minimalist keystroke visualization
- Draggable display that can be moved with mouse or touch
- Touch device support (mobile and tablet)
- Shows modifier keys (⌘, ⌃, ⌥, ⇧) separately
- Smooth animations for key presses and removals
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
  x: 960,                         // Initial X position (default: center-bottom)
  y: 800,                         // Initial Y position (default: center-bottom)
  displayDuration: 2000,          // How long to show each key (ms, default: 2000)
  maxKeys: 5,                     // Max keys to display at once (default: 5)
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
  x?: number;                 // Initial X position (default: center-bottom)
  y?: number;                 // Initial Y position (default: center-bottom)
  displayDuration?: number;   // Display duration in ms (default: 2000)
  maxKeys?: number;           // Max simultaneous keys (default: 5)
  enabled?: boolean;          // Start enabled (default: true)
}
```

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
