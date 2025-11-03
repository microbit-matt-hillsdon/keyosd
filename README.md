# KeyCastJS

A minimalist TypeScript library for displaying keystrokes like the Mac app KeyCastr with the Svelte visualizer mode.

## Features

- KeyCastr Svelte mode visualization
- Fixed 200×100px compact display
- Displays up to 6 characters of recent keystrokes with automatic text scaling (SVG-based)
- Keystrokes persist and show the most recent input
- Display clears automatically when modifier keys are pressed/released
- Persistent modifier key indicators with platform-specific symbols:
  - **Mac:** ⇧ ⌃ ⌥ ⌘
  - **Windows:** ⇧ ^ ⎇ ⊞
- Modifiers shown in both the display area and as hold state indicators
- Positioned in bottom-right by default (1rem inset)
- Fixed positioning - stays visible when scrolling
- Smart corner-relative anchoring - maintains position on window resize
- Automatic bounds checking - never moves out of viewport
- Draggable display that can be moved with mouse or touch
- Touch device support (mobile and tablet)
- Cross-platform support (Mac, Windows, Linux)
- Text automatically scales to fit using SVG
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
- **Scrollbar-aware:** Accounts for scrollbar presence when positioning
- **Fixed positioning:** Stays visible when scrolling
- **Corner-relative anchoring:** When dragged, automatically anchors to the nearest corner
- **Smart resize behavior:** Maintains position relative to its anchor corner when window resizes
- **Bounds checking:** Automatically constrains position within viewport
- **Draggable:** Click and drag to reposition anywhere on screen

## Keyboard Layout Support

KeyCastJS handles keyboard layouts intelligently based on the context:

### Normal Typing (No Modifiers or Shift Only)
Uses the actual character typed (`KeyboardEvent.key`), which respects your keyboard layout:
- **AZERTY keyboards:** Typing "a" shows "a" (not "q")
- **Dvorak keyboards:** Shows the actual character you typed
- **International layouts:** Correctly displays layout-specific characters

### Modifier Combinations (⌘/⌃/⎇ + Key)
Uses physical key positions (`KeyboardEvent.code`) with layout-aware mapping:
- **Why:** Prevents displaying unintended characters (e.g., Option+C producing "ç" on Mac)
- **Progressive Enhancement:** Uses `KeyboardLayoutMap` API when available (Chrome/Edge/Opera)
- **Fallback:** Uses static QWERTY mapping on Firefox/Safari and non-HTTPS contexts

#### Behavior by Browser:

**Chrome, Edge, Opera (with HTTPS):**
- Uses `KeyboardLayoutMap` for layout-aware shortcuts
- **AZERTY keyboard:** Cmd+A displays as "⌘A" (respects layout) ✓
- **Dvorak keyboard:** Cmd+T displays as "⌘T" (respects layout) ✓
- **Best experience:** Shortcuts show actual key labels regardless of layout

**Firefox, Safari, HTTP contexts:**
- Uses static QWERTY-based mapping
- **AZERTY keyboard:** Cmd+A displays as "⌘Q" (physical QWERTY position)
- **Still works:** Prevents weird characters, shortcuts remain recognizable
- **Note:** Firefox and Safari have declined to implement `KeyboardLayoutMap` for privacy reasons (fingerprinting concerns)

This approach is optimized for screencasts and tutorials where:
- Normal typing should reflect actual keyboard layout
- Shortcuts should be clearly displayed (layout-aware in Chromium, QWERTY-based elsewhere)
- The library works universally across all modern browsers

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
