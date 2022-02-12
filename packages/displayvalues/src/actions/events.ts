import { isFormField } from '@finsweet/ts-utils';

import { getSelector } from '../utils/constants';
import { syncValue } from './sync';

/**
 * Listens for input events.
 */
export const listenEvents = () => {
  window.addEventListener('input', ({ target }) => {
    if (!(target instanceof Element)) return;

    const sourceElement = target.closest(getSelector('element', 'source', { operator: 'prefixed' }));

    if (isFormField(sourceElement)) syncValue(sourceElement);
  });
};
