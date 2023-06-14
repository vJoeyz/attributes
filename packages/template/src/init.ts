import { awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';

import { logHello } from './actions/console';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  logHello();

  return {};
};
