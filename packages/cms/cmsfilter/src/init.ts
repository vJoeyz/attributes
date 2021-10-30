import { ATTRIBUTES, getSelector } from './constants';
import { FORM_CSS_CLASSES, isNotEmpty } from '@finsweet/ts-utils';
import { importCMSCore } from '$utils/import';
import { CMSFilters } from './CMSFilter';
import { listenListEvents } from './events';
import { addListAnimation } from '$cms/utils/animation';

import type { FormBlockElement } from '@finsweet/ts-utils';
import type { CMSList } from '$cms/cmscore/src';
import type { CMSCore } from '$cms/cmscore/src/types';

// Constants destructuring
const {
  element: { key: elementKey },
  duration: { key: durationKey },
  easing: { key: easingKey },
  showQuery: { key: showQueryKey, values: showQueryValues },
  scrollTop: { key: scrollTopKey, values: scrollTopValues },
} = ATTRIBUTES;

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSFilters[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  const filtersInstances = (
    await Promise.all(listInstances.map((listInstance) => initFilters(listInstance, cmsCore)))
  ).filter(isNotEmpty);

  console.log({ filtersInstances });

  return filtersInstances;
};

/**
 * Creates a new {@link CMSFilters} instance for each {@link CMSList}.
 * @param listInstance The `CMSList` instance.
 */
const initFilters = async (listInstance: CMSList, cmsCore: CMSCore) => {
  const instanceIndex = listInstance.getInstanceIndex(elementKey);

  // Base elements
  const filters = document.querySelector(getSelector('element', 'filters', { instanceIndex }));
  if (!filters) return;

  const formBlock = filters.closest<FormBlockElement>(`.${FORM_CSS_CLASSES.formBlock}`);
  if (!formBlock) return;

  // Empty State Element
  const emptyElement = document.querySelector<HTMLElement>(getSelector('element', 'empty', { instanceIndex }));
  if (emptyElement) listInstance.addEmptyElement(emptyElement);

  // Results Count
  const resultsElement = document.querySelector<HTMLElement>(getSelector('element', 'results', { instanceIndex }));

  // Query Params
  const showQueryParams = listInstance.getAttribute(showQueryKey) === showQueryValues.true;

  // Scroll Top
  const scrollTop = listInstance.getAttribute(scrollTopKey) === scrollTopValues.true;

  // Animation
  if (!listInstance.listAnimation) addListAnimation(listInstance, { durationKey, easingKey });

  // Init instances
  const filtersInstance = new CMSFilters(formBlock, listInstance, cmsCore, {
    resultsElement,
    showQueryParams,
    scrollTop,
  });

  // Listen events
  listenListEvents(filtersInstance, listInstance, cmsCore);

  return filtersInstance;
};
