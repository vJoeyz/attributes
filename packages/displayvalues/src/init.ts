import { isFormField } from '@finsweet/ts-utils';

import { collectTargets } from './actions/collect';
import { listenEvents } from './actions/events';
import { syncValue } from './actions/sync';
import { ATTRIBUTE, getSelector } from './utils/constants';

/**
 * Inits click events mirroring.
 */
export const init = (): NodeListOf<Element> => {
  const sourceElements = document.querySelectorAll(getSelector('element', 'source', { operator: 'prefixed' }));

  for (const sourceElement of sourceElements) {
    if (!isFormField(sourceElement)) continue;

    collectTargets(sourceElement);
    syncValue(sourceElement);
  }

  listenEvents();

  window.fsAttributes[ATTRIBUTE].resolve?.(sourceElements);

  return sourceElements;
};
