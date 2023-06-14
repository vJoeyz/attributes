import { awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';

import { initInputActiveClasses } from './factory';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  const cleanup = initInputActiveClasses();

  return {
    destroy() {
      cleanup();
    },
  };
};
