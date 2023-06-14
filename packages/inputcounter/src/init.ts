import { awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';
import { isNotEmpty } from '@finsweet/ts-utils';

import { initInputCounter } from './factory';
import { getElementSelector } from './utils/selectors';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  const inputElements = [...document.querySelectorAll<HTMLInputElement>(`input${getElementSelector('input')}`)];

  const cleanups = inputElements.map(initInputCounter).filter(isNotEmpty);

  window.fsAttributes.import('a11y');

  return {
    result: inputElements,
    destroy() {
      for (const cleanup of cleanups) cleanup();
    },
  };
};
