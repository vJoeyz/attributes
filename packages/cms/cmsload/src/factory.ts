import { ATTRIBUTES, getSelector } from './constants';
import { initRenderAllMode } from './modes/render-all';
import { initInfiniteMode } from './modes/infinite';
import { initDefaultMode } from './modes/default';
import { initPaginateMode } from './modes/paginate';
import { addItemsAnimation, addListAnimation } from '$cms/utils/animation';

import type { CMSList } from '$cms/cmscore/src';

// Types

// Constants
const {
  element: { key: elementKey },
  mode: {
    key: modeKey,
    values: { renderAll, infinite, pagination },
  },
  animation: { key: animationKey },
  duration: { key: durationKey },
  easing: { key: easingKey },
  stagger: { key: staggerKey },
  resetIx: { key: resetIxKey, values: resetIxValues },
} = ATTRIBUTES;

/**
 * Gets the base config and inits a `mode` for a `CMSList` instance.
 * @param listInstance The {@link CMSList} instance.
 * @returns The same instance.
 */
export const initLoadInstance = async (listInstance: CMSList) => {
  const instanceIndex = listInstance.getInstanceIndex(elementKey);

  // Get animation config
  addItemsAnimation(listInstance, { animationKey, durationKey, easingKey, staggerKey });

  if (!listInstance.listAnimation) addListAnimation(listInstance, { durationKey, easingKey });

  // Get resetIx config
  const resetIx = listInstance.getAttribute(resetIxKey) === resetIxValues.true;
  if (resetIx) listInstance.resetIx = resetIx;

  // Get loader
  const loaderElement = document.querySelector<HTMLElement>(getSelector('element', 'loader', { instanceIndex }));
  if (loaderElement) listInstance.addLoader(loaderElement);

  // Get items count element
  if (!listInstance.itemsCount) {
    const itemsCount = document.querySelector<HTMLElement>(getSelector('element', 'itemsCount', { instanceIndex }));
    if (itemsCount) listInstance.itemsCount = itemsCount;
  }

  // Get scroll anchor
  if (!listInstance.scrollAnchor) {
    const scrollAnchor = document.querySelector<HTMLElement>(getSelector('element', 'scrollAnchor', { instanceIndex }));
    if (scrollAnchor) listInstance.scrollAnchor = scrollAnchor;
  }

  // Init mode
  const mode = listInstance.getAttribute(modeKey);

  if (mode === renderAll) await initRenderAllMode(listInstance);
  else if (mode === infinite) initInfiniteMode(listInstance);
  else if (mode === pagination) await initPaginateMode(listInstance);
  else initDefaultMode(listInstance);

  return listInstance;
};
