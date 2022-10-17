import { A11Y_ATTRIBUTE, CMS_ATTRIBUTE_ATTRIBUTE } from 'global/constants/attributes';

import { observeAriaControls } from './actions/aria-controls';
import { emitClickEvents } from './actions/keyboard';

/**
 * Inits the attribute.
 */
export const init = async () => {
  await window.fsAttributes[CMS_ATTRIBUTE_ATTRIBUTE]?.loading;

  emitClickEvents();
  observeAriaControls();

  window.fsAttributes[A11Y_ATTRIBUTE].resolve?.(undefined);
};
