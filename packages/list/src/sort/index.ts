import { isHTMLSelectElement } from '@finsweet/attributes-utils';

import type { List } from '../components/List';
import { initButtons } from './buttons';
import { initHTMLSelect } from './select';

/**
 * Inits sorting functionality for the list.
 */
export const initListSorting = (list: List, triggers: HTMLElement[]) => {
  // Init mode
  const [firstTrigger] = triggers;
  const isSelect = isHTMLSelectElement(firstTrigger);

  const cleanup = isSelect ? initHTMLSelect(firstTrigger, list) : initButtons(triggers, list);

  return cleanup;
};
