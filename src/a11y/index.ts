import { observeAriaControls } from './aria/aria-controls';
import { initComboBoxes } from './components/combo-box';
import { emitClickEvents } from './keyboard-navigation/clicks';

document.addEventListener('DOMContentLoaded', () => {
  emitClickEvents();
  observeAriaControls();
  // initComboBoxes();
});
