import { awaitAttributeLoaded, awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';

import { observeAriaControls } from './actions/aria-controls';
import { handleKeyboardEvents } from './actions/keyboard';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  await awaitAttributeLoaded('modal');
  await awaitAttributeLoaded('inputcounter');
  await awaitAttributeLoaded('accordion');

  const keyboardCleanup = handleKeyboardEvents();
  const observersCleanup = observeAriaControls();

  return {
    destroy() {
      keyboardCleanup();
      observersCleanup();
    },
  };
};
