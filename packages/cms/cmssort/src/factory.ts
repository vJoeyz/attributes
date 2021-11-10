import { ATTRIBUTES, DEFAULT_ASC_CLASS, DEFAULT_DESC_CLASS, getSelector } from './constants';
import { addListAnimation } from '$cms/utils/animation';
import { initHTMLSelect } from './select';
import { initButtons } from './buttons';

import type { CSSClasses } from './types';
import type { CMSList } from '$cms/cmscore/src';

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

  // Init mode
  const [firstTrigger] = triggers;

  const originalItemsOrder = [...items];

  const sortItems =
    firstTrigger instanceof HTMLSelectElement
      ? initHTMLSelect(firstTrigger, listInstance, originalItemsOrder)
      : initButtons(triggers, listInstance, cssClasses);

  listInstance.on('shouldcollectprops', async (newItems) => {
    for (const item of newItems) item.collectProps({ fieldKey, typeKey });
  });

  listInstance.on('shouldsort', async (newItems) => {
    originalItemsOrder.push(...newItems);

    await sortItems(true);
  });
};
