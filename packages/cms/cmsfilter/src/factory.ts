import { CMSFilters } from './CMSFilters';
import { CMSTags } from './CMSTags';
import { isKeyOf, FORM_CSS_CLASSES } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector, TAGS_MODES } from './constants';
import { addListAnimation } from '$cms/utils/animation';

import type { CMSList } from '$cms/cmscore/src';
import type { FormBlockElement } from '@finsweet/ts-utils';

// Constants destructuring
const {
  element: { key: elementKey },
  duration: { key: durationKey },
  easing: { key: easingKey },
  showQuery: { key: showQueryKey, values: showQueryValues },
  tagsFormat: { key: tagsFormatKey },
} = ATTRIBUTES;

/**
 * Creates a new {@link CMSFilters} instance.
 * @param listInstance The {@link CMSList} instance.
 * @returns The new instance, if valid.
 */
export const createCMSFiltersInstance = (listInstance: CMSList): CMSFilters | undefined => {
  const instanceIndex = listInstance.getInstanceIndex(elementKey);

  // Base elements
  const filters = document.querySelector(getSelector('element', 'filters', { instanceIndex }));
  if (!filters) return;

  const formBlock = filters.closest<FormBlockElement>(`.${FORM_CSS_CLASSES.formBlock}`);
  if (!formBlock) return;

  // Animation
  if (!listInstance.listAnimation) addListAnimation(listInstance, { durationKey, easingKey });

  // Empty State Element
  const emptyElement = document.querySelector<HTMLElement>(getSelector('element', 'empty', { instanceIndex }));
  if (emptyElement) listInstance.addEmptyElement(emptyElement);

  // Scroll Anchor Element
  if (!listInstance.scrollAnchor) {
    const scrollAnchor = document.querySelector<HTMLElement>(getSelector('element', 'scrollAnchor', { instanceIndex }));
    if (scrollAnchor) listInstance.scrollAnchor = scrollAnchor;
  }

  // Items Count Element
  if (!listInstance.itemsCount) {
    const itemsCount = document.querySelector<HTMLElement>(getSelector('element', 'itemsCount', { instanceIndex }));
    if (itemsCount) listInstance.itemsCount = itemsCount;
  }

  // Results Count Element
  const resultsElement = document.querySelector<HTMLElement>(getSelector('element', 'results', { instanceIndex }));

  // Query Params
  const showQueryParams = listInstance.getAttribute(showQueryKey) === showQueryValues.true;

  // Init instance
  const filtersInstance = new CMSFilters(formBlock, listInstance, {
    resultsElement,
    showQueryParams,
  });

  return filtersInstance;
};

/**
 * Creates a new {@link CMSTags} instance.
 * @param listInstance The {@link CMSList} instance.
 * @param filtersInstance The {@link CMSFilters} instance.
 * @returns The new instance, if valid.
 */
export const createCMSTagsInstance = async (
  listInstance: CMSList,
  filtersInstance: CMSFilters
): Promise<CMSTags | undefined> => {
  const instanceIndex = listInstance.getInstanceIndex(elementKey);

  const tagsTemplate = document.querySelector<HTMLElement>(getSelector('element', 'tagTemplate', { instanceIndex }));
  if (!tagsTemplate) return;

  const rawTagsFormat = listInstance.getAttribute(tagsFormatKey);
  const tagsFormat = isKeyOf(rawTagsFormat, TAGS_MODES) ? rawTagsFormat : undefined;

  const tagsInstance = new CMSTags(tagsTemplate, tagsFormat, filtersInstance, listInstance);

  await filtersInstance.addTagsInstance(tagsInstance);

  return tagsInstance;
};
