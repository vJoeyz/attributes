import { ATTRIBUTES, DEFAULT_ANIMATION_DURATION, getSelector } from './constants';
import { FORM_CSS_CLASSES, isKeyOf, isNotEmpty } from '@finsweet/ts-utils';
import { getCollectionListWrappers } from 'packages/cms/helpers';
import { importAnimations, importCMSCore } from '$utils/import';
import { CMSFilters } from './CMSFilter';

import type { FormBlockElement } from '@finsweet/ts-utils';
import type { CMSList } from 'packages/cms/cmscore/src';

// Constants destructuring
const {
  element: { key: elementKey },
  showQuery: { key: showQueryKey, values: showQueryValues },
  duration: { key: durationKey },
  easing: { key: easingKey },
  scrollTop: { key: scrollTopKey, values: scrollTopValues },
} = ATTRIBUTES;

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSFilters[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  const collectionListWrappers = getCollectionListWrappers([getSelector('element', 'list', { operator: 'prefixed' })]);

  const listInstances = collectionListWrappers.map(cmsCore.createCMSListInstance).filter(isNotEmpty);

  const filtersInstances = (await Promise.all(listInstances.map(initFilters))).filter(isNotEmpty);

  console.log({ filtersInstances });

  return filtersInstances;
};

/**
 * Creates a new {@link CMSFilters} instance for each {@link CMSList}.
 * @param listInstance The `CMSList` instance.
 */
const initFilters = async (listInstance: CMSList) => {
  const instanceIndex = listInstance.getInstanceIndex(elementKey);

  // Base elements
  const filters = document.querySelector(getSelector('element', 'filters', { instanceIndex }));
  if (!filters) return;

  const formBlock = filters.closest<FormBlockElement>(`.${FORM_CSS_CLASSES.formBlock}`);
  if (!formBlock) return;

  // Empty State Element
  const emptyElement = document.querySelector<HTMLElement>(getSelector('element', 'empty', { instanceIndex }));
  emptyElement?.remove();

  // Results Count
  const resultsElement = document.querySelector<HTMLElement>(getSelector('element', 'results', { instanceIndex }));

  // Query Params
  const showQueryParams = listInstance.getAttribute(showQueryKey) === showQueryValues.true;

  // Animation
  if (!listInstance.listAnimation) {
    importAnimations().then((animationsImport) => {
      if (!animationsImport) return;

      const {
        animations: { fade },
        easings,
      } = animationsImport;

      const animationDuration = listInstance.getAttribute(durationKey);
      const animationEasing = listInstance.getAttribute(easingKey);

      listInstance.listAnimation = {
        ...fade,
        options: {
          easing: isKeyOf(animationEasing, easings) ? animationEasing : undefined,
          duration: animationDuration ? parseFloat(animationDuration) / 200 : DEFAULT_ANIMATION_DURATION,
        },
      };
    });
  }

  // Scroll Top
  const scrollTop = listInstance.getAttribute(scrollTopKey) === scrollTopValues.true;

  // Init instances
  const filtersInstance = new CMSFilters(formBlock, listInstance, {
    emptyElement,
    resultsElement,
    showQueryParams,
    scrollTop,
  });

  return filtersInstance;
};
