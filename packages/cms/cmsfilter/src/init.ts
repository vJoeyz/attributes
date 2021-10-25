import { ATTRIBUTES, DEFAULT_ANIMATION_DURATION, getSelector } from './constants';
import { FORM_CSS_CLASSES, isKeyOf, isNotEmpty } from '@finsweet/ts-utils';
import { getCollectionListWrappers } from 'packages/cms/helpers';
import { createCMSListInstance } from 'packages/cms/CMSList';
import { importAnimations } from '$utils/import';
import { CMSFilters } from './CMSFilter';

import type { CMSList } from 'packages/cms/CMSList';
import type { FormBlockElement } from '@finsweet/ts-utils';

// Types
interface Params {
  listsSelector?: string;
}

// Constants destructuring
const {
  element: { key: elementKey },
  showQuery: { key: showQueryKey, values: showQueryValues },
  duration: { key: durationKey },
  easing: { key: easingKey },
  scrollTop: { key: scrollTopKey, values: scrollTopValues },
  lists: { key: listsKey },
} = ATTRIBUTES;

/**
 * Inits the attribute.
 *
 * Auto init:
 * @param params The current `<script>` element.
 *
 * Programatic init:
 * @param params.param A global parameter.
 */
export const init = (params?: HTMLOrSVGScriptElement | Params | null): void => {
  let globalListsSelector: string | null | undefined;

  if (params instanceof HTMLScriptElement || params instanceof SVGScriptElement) {
    globalListsSelector = params.getAttribute(listsKey);
  } else if (params) {
    globalListsSelector = params.listsSelector;
  }

  const collectionListWrappers = getCollectionListWrappers([
    getSelector('element', 'list', { operator: 'prefixed' }),
    globalListsSelector,
  ]);

  const listInstances = collectionListWrappers.map(createCMSListInstance).filter(isNotEmpty);

  const filtersInstances = listInstances.map(initFilters);

  console.log({ filtersInstances });
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
