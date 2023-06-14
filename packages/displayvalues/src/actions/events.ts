import { addListener, isElement, isFormField } from '@finsweet/ts-utils';

import { getElementSelector } from '../utils/selectors';
import { syncValue } from './sync';

/**
 * Listens for input events.
 * @returns A callback to remove the event listeners.
 */
export const listenEvents = () => {
  const inputCleanup = addListener(window, 'input', ({ target }: Event) => {
    if (!isElement(target)) return;

    const sourceElement = target.closest(getElementSelector('source'));

    if (isFormField(sourceElement)) {
      syncValue(sourceElement);
    }
  });

  return inputCleanup;
};
