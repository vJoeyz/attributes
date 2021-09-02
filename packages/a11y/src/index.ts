import { observeAriaControls } from './aria/aria-controls';
import { emitClickEvents } from './keyboard/keyboard-clicks';

document.addEventListener('DOMContentLoaded', () => {
  emitClickEvents();
  observeAriaControls();
});
