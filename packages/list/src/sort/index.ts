import { DROPDOWN_CSS_CLASSES, type DropdownElement, isHTMLSelectElement } from '@finsweet/attributes-utils';

import type { List } from '../components/List';
import { initButtons } from './buttons';
// import { initDropdown } from './dropdown';
import { initHTMLSelect } from './select';

export const initListSorting = (list: List, triggers: HTMLElement[]) => {
  // Init mode
  const [firstTrigger] = triggers;
  const isSelect = isHTMLSelectElement(firstTrigger);
  const isDropdown = firstTrigger.closest<DropdownElement>(`.${DROPDOWN_CSS_CLASSES.dropdown}`);

  if (isSelect) {
    initHTMLSelect(firstTrigger, list);
  } else if (isDropdown) {
    // initDropdown(firstTrigger, list);
  } else {
    initButtons(triggers, list);
  }
};
