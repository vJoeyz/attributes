import { ATTRIBUTES, DEFAULT_ASC_CLASS, DEFAULT_DESC_CLASS, getSelector } from './constants';
import { DROPDOWN_CSS_CLASSES } from '@finsweet/ts-utils';
import { addListAnimation } from '$cms/utils/animation';
import { listenListEvents } from './events';
import { initHTMLSelect } from './select';
import { initDropdown } from './dropdown';
import { initButtons } from './buttons';

import type { CSSClasses } from './types';
import type { CMSList } from '$cms/cmscore/src';
import type { Dropdown } from '@finsweet/ts-utils';

// Constants destructuring
const {
  element: { key: elementKey },
  field: { key: fieldKey },
  type: { key: typeKey },
  duration: { key: durationKey },
  easing: { key: easingKey },
  ascClass: { key: ascClassKey },
  descClass: { key: descClassKey },
} = ATTRIBUTES;

/**
 * Inits sorting on a `CMSList`.
 * @param listInstance The {@link CMSList} instance.
 * @returns An awaitable Promise.
 */
export const initListSorting = async (listInstance: CMSList) => {
  const instanceIndex = listInstance.getInstanceIndex(elementKey);

  const triggers = document.querySelectorAll<HTMLElement>(getSelector('element', 'trigger', { instanceIndex }));
  if (!triggers.length) return;

  const { items, listAnimation } = listInstance;

  // Store item props
  for (const item of items) item.collectProps({ fieldKey, typeKey });

  // Animation
  if (!listAnimation) addListAnimation(listInstance, { durationKey, easingKey });

  // CSS Classes
  const cssClasses: CSSClasses = {
    asc: listInstance.getAttribute(ascClassKey) || DEFAULT_ASC_CLASS,
    desc: listInstance.getAttribute(descClassKey) || DEFAULT_DESC_CLASS,
  };

  // Store original items order
  const originalItemsOrder = [...items];

  // Init mode
  const [firstTrigger] = triggers;
  const isSelect = firstTrigger instanceof HTMLSelectElement;
  const isDropdown = firstTrigger.closest<Dropdown>(`.${DROPDOWN_CSS_CLASSES.dropdown}`);

  const sortItems = isSelect
    ? await initHTMLSelect(firstTrigger, listInstance, originalItemsOrder)
    : isDropdown
    ? initDropdown(isDropdown, listInstance, originalItemsOrder)
    : initButtons(triggers, listInstance, originalItemsOrder, cssClasses);

  if (!sortItems) return;

  // Listen events
  listenListEvents(listInstance, originalItemsOrder, sortItems);
};
