import { KeyOSD } from './keyosd';

// Auto-initialize when loaded as a script tag
if (typeof window !== 'undefined') {
  let instance: KeyOSD | null = null;

  // Initialize on DOM ready
  const init = () => {
    if (!instance) {
      instance = new KeyOSD();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose to window for script tag users who want to control it
  (window as any).KeyOSD = KeyOSD;
  Object.defineProperty(window, 'keyosd', {
    get() {
      return instance;
    }
  });
}
