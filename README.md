# KeyOSD

Display keystrokes and shortcuts in an on-screen overlay.

## Features

- Compact visualization inspired by [KeyCastr](https://github.com/keycastr/keycastr)'s Svelte-mode
- Shows recent keystrokes and keyboard shortcuts
- Draggable overlay anchors to corners
- Platform-specific modifier key display
- Respects keyboard layouts (Chrome/Edge only)

## Installation

```bash
npm install keyosd
```

## Usage

### Standalone (Script Tag)

Just include the standalone script and CSS. KeyOSD will automatically initialize:

```html
<link rel="stylesheet" href="https://unpkg.com/keyosd/dist/keyosd.css" />
<script src="https://unpkg.com/keyosd/dist/keyosd.standalone.umd.cjs"></script>
```

The overlay will appear automatically and start capturing keystrokes. Access the instance via `window.keyosd` if you need to control it:

```javascript
// Disable/enable
window.keyosd.disable();
window.keyosd.enable();

// Clear display
window.keyosd.clear();
```

### As a Module

Import and initialize manually for more control:

```typescript
import { KeyOSD } from "keyosd";

// Initialize with default options
const keyosd = new KeyOSD();
```

### With Options

```typescript
import { KeyOSD } from "keyosd";

const keyosd = new KeyOSD({
  container: document.body, // Container element (default: document.body)
  enabled: true, // Start capturing immediately (default: true)
});
```

## API

### Constructor

```typescript
new KeyOSD(options?: KeyOSDOptions)
```

### Methods

#### `enable()`

Start capturing keyboard events.

```typescript
keyosd.enable();
```

#### `disable()`

Stop capturing keyboard events.

```typescript
keyosd.disable();
```

#### `clear()`

Clear all currently displayed keystrokes.

```typescript
keyosd.clear();
```

#### `destroy()`

Remove the visualization and clean up all event listeners.

```typescript
keyosd.destroy();
```

## Options

```typescript
interface KeyOSDOptions {
  container?: HTMLElement; // Container element (default: document.body)
  enabled?: boolean; // Start enabled (default: true)
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

**Normal typing** shows the actual characters you type, respecting your keyboard layout (AZERTY, Dvorak, etc.).

**Keyboard shortcuts** (with Cmd/Ctrl/Alt) work differently:

- **Chrome/Edge/Opera**: Uses your actual keyboard layout. On AZERTY, Cmd+A shows "⌘A" ✓
- **Firefox/Safari**: Uses QWERTY positions as no keyboard layout API is available.

This prevents displaying unintended characters (like Option+C producing "ç"). There might be a better compromise position here and feedback is welcome.

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
