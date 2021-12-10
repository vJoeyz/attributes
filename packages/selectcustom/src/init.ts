import { DROPDOWN_CSS_CLASSES } from '@finsweet/ts-utils';
import { collectSettings } from './actions/settings';
import { populateOptions } from './actions/populate';
import { getSelector } from './utils/constants';

import type { Dropdown } from '@finsweet/ts-utils';
import { listenEvents } from './actions/events';

/**
 * Inits the attribute.
 */
export const init = (): void => {
  const dropdowns = document.querySelectorAll<Dropdown>(
    `.${DROPDOWN_CSS_CLASSES.dropdown}${getSelector('element', 'dropdown', { operator: 'prefixed' })}`
  );

  for (const dropdown of dropdowns) initCustomSelect(dropdown);
};

/**
 * Inits a new custom select instance.
 * @param dropdown The {@link Dropdown} element.
 */
const initCustomSelect = (dropdown: Dropdown) => {
  const settings = collectSettings(dropdown);
  if (!settings) return;

  populateOptions(settings);

  listenEvents(settings);
};
