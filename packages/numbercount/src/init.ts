import { CMS_ATTRIBUTE_ATTRIBUTE, NUMBER_COUNT_ATTRIBUTE } from '$global/constants/attributes';
import { awaitAttributesLoad, finalizeAttribute } from '$global/factory';

import { initNumberCount } from './factory';
import { queryElement } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async () => {
  await awaitAttributesLoad(CMS_ATTRIBUTE_ATTRIBUTE);

  const numberElements = queryElement('number', { operator: 'prefixed', all: true });

  for (const numberElement of numberElements) {
    initNumberCount(numberElement);
  }

  return finalizeAttribute(NUMBER_COUNT_ATTRIBUTE, numberElements);
};
