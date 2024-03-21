import { type FsAttributeInit, waitWebflowReady } from '@finsweet/attributes-utils';

import { initInputActiveClasses } from './factory';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await waitWebflowReady();

  const cleanup = initInputActiveClasses();

  return {
    destroy() {
      cleanup();
    },
  };
};
