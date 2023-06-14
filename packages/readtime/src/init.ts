import { awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';

import { initReadTime } from './factory';
import { queryAllElements } from './utils/selectors';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  const timeElements = queryAllElements('time');

  for (const timeElement of timeElements) {
    initReadTime(timeElement);
  }

  return {};
};
