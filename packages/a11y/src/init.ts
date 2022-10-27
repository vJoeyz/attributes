import {
  A11Y_ATTRIBUTE,
  CMS_ATTRIBUTE_ATTRIBUTE,
  INPUT_COUNTER_ATTRIBUTE,
  MODAL_ATTRIBUTE,
} from '$global/constants/attributes';
import { awaitAttributesLoad, finalizeAttribute } from '$global/factory';

import { observeAriaControls } from './actions/aria-controls';
import { emitClickEvents } from './actions/keyboard';

/**
 * Inits the attribute.
 */
export const init = async () => {
  await awaitAttributesLoad(CMS_ATTRIBUTE_ATTRIBUTE, MODAL_ATTRIBUTE, INPUT_COUNTER_ATTRIBUTE);

  const destroyClickEventsEmitter = emitClickEvents();
  const destroyAriaControlsObservers = observeAriaControls();

  return finalizeAttribute(A11Y_ATTRIBUTE, undefined, () => {
    destroyClickEventsEmitter();
    destroyAriaControlsObservers();
  });
};
