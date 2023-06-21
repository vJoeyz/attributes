import { addListAnimation, type CMSList } from '@finsweet/attributes-cmscore';
import { type Dropdown, DROPDOWN_CSS_CLASSES, isHTMLSelectElement } from '@finsweet/attributes-utils';

import { listenListEvents } from './actions/events';
import { initButtons } from './modes/buttons';
import { initDropdown } from './modes/dropdown';
import { initHTMLSelect } from './modes/select';
import { DEFAULT_ASC_CLASS, DEFAULT_DESC_CLASS, SETTINGS } from './utils/constants';
import { getAttribute, getInstanceIndex, queryAllElements, queryElement } from './utils/selectors';
import type { CSSClasses } from './utils/types';

// Constants destructuring
const {
  field: { key: fieldKey },
  type: { key: typeKey },
  duration: { key: durationKey },
  easing: { key: easingKey },
} = SETTINGS;

/**
 * Inits sorting on a `CMSList`.
 * @param listInstance The {@link CMSList} instance.
 *
 * @returns A cleanup callback.
 */
export const initListSorting = async (listInstance: CMSList) => {
  const { listOrWrapper } = listInstance;

  const instanceIndex = getInstanceIndex(listOrWrapper);

  const triggers = queryAllElements('trigger', { instanceIndex });
  if (!triggers.length) return;

  const { items } = listInstance;

  // Store item props
  for (const item of items) item.collectProps({ fieldKey, typeKey });

  // Animation
  addListAnimation(listInstance, { durationKey, easingKey });

  // Scroll Anchor Element
  if (!listInstance.scrollAnchor) {
    const scrollAnchor = queryElement('scroll-anchor', { instanceIndex });
    if (scrollAnchor) listInstance.scrollAnchor = scrollAnchor;
  }

  // CSS Classes
  const cssClasses: CSSClasses = {
    asc: getAttribute(listOrWrapper, 'asc') || DEFAULT_ASC_CLASS,
    desc: getAttribute(listOrWrapper, 'desc') || DEFAULT_DESC_CLASS,
  };

  // Init mode
  const [firstTrigger] = triggers;
  const isSelect = isHTMLSelectElement(firstTrigger);
  const isDropdown = firstTrigger.closest<Dropdown>(`.${DROPDOWN_CSS_CLASSES.dropdown}`);

  const sortActions = isSelect
    ? await initHTMLSelect(firstTrigger, listInstance)
    : isDropdown
    ? initDropdown(isDropdown, listInstance)
    : initButtons(triggers, listInstance, cssClasses);

  if (!sortActions) return;

  // Listen events
  listenListEvents(listInstance, sortActions.sortItems);

  return sortActions.cleanup;
};
