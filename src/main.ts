import { KeyCastJS } from './KeyCastJS';

// Initialize KeyCastJS
const keyCast = new KeyCastJS();

// Setup demo controls
const toggleBtn = document.getElementById('toggleBtn') as HTMLButtonElement;
const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;

let isEnabled = true;

toggleBtn?.addEventListener('click', () => {
  if (isEnabled) {
    keyCast.disable();
    toggleBtn.textContent = 'Enable';
    isEnabled = false;
  } else {
    keyCast.enable();
    toggleBtn.textContent = 'Disable';
    isEnabled = true;
  }
});

clearBtn?.addEventListener('click', () => {
  keyCast.clear();
});
