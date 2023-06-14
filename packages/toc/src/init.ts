import { awaitAttributeLoaded, awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';
import { isNotEmpty, restartWebflow } from '@finsweet/ts-utils';

import { scrollToAnchor } from './actions/scroll';
import { initTOCInstance } from './factory';
import { queryAllElements } from './utils/selectors';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();
  await awaitAttributeLoaded('richtext');

  const contentsElements = queryAllElements('contents');

  const cleanups = contentsElements.map(initTOCInstance).filter(isNotEmpty);

  // URL hash Anchor
  scrollToAnchor();

  if (cleanups.length) {
    await restartWebflow();
  }

  // TODO: Finish API
  return {
    destroy() {
      for (const cleanup of cleanups) cleanup();
    },
  };
};
