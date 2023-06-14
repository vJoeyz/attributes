import { awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';
import { isNotEmpty } from '@finsweet/ts-utils';

import { initNumberCount } from './factory';
import { queryAllElements } from './utils/selectors';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  const numberElements = queryAllElements('number');

  const cleanups = numberElements.map(initNumberCount).filter(isNotEmpty);

  return {
    result: numberElements,
    destroy() {
      for (const cleanup of cleanups) cleanup();
    },
  };
};
