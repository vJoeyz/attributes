import { CMS_ATTRIBUTE_ATTRIBUTE } from 'global/constants/attributes';

import { initReadTime } from './factory';
import { ATTRIBUTE, queryElement } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async () => {
  await window.fsAttributes[CMS_ATTRIBUTE_ATTRIBUTE]?.loading;

  const timeElements = queryElement('time', { operator: 'prefixed', all: true });

  for (const timeElement of timeElements) {
    initReadTime(timeElement);
  }

  window.fsAttributes[ATTRIBUTE].resolve?.(undefined);
};
