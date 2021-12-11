import { DROPDOWN_CSS_CLASSES } from '@finsweet/ts-utils';
import { collectSettings } from './actions/settings';
import { populateOptions } from './actions/populate';
import { observeElements } from './actions/observe';
import { getSelector } from './utils/constants';
import { listenEvents } from './actions/events';

import type { Dropdown } from '@finsweet/ts-utils';

/**
 * Inits the attribute.
 */
export const init = (): void => {
  const referenceElements = document.querySelectorAll<HTMLElement>(
    getSelector('element', 'dropdown', { operator: 'prefixed' })
  );

  for (const referenceElement of referenceElements) initCustomSelect(referenceElement);
};

/**
 * Inits a new custom select instance.
 * @param referenceElement The element that has the `dropdown` attribute.
 */
const initCustomSelect = (referenceElement: HTMLElement) => {
  const dropdown = referenceElement.closest<Dropdown>(`.${DROPDOWN_CSS_CLASSES.dropdown}`);
  if (!dropdown) return;

  const settings = collectSettings(dropdown);
  if (!settings) return;

  populateOptions(settings);
  observeElements(settings);
  listenEvents(settings);
};
