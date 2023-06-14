import { awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';
import { isNotEmpty } from '@finsweet/ts-utils';

import { initModal } from './factory';
import { queryAllElements } from './utils/selectors';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  const modalElements = queryAllElements('modal');

  const cleanups = modalElements.map(initModal).filter(isNotEmpty);

  window.fsAttributes.import('a11y');

  return {
    result: modalElements,
    destroy() {
      for (const cleanup of cleanups) cleanup();
    },
  };
};
