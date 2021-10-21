import { ATTRIBUTES, DEFAULT_ANIMATION_DURATION, getSelector } from './constants';
import { FORM_CSS_CLASSES, isKeyOf, isNotEmpty } from '@finsweet/ts-utils';
import { getCollectionListWrappers } from 'packages/cms/helpers';
import { createCMSListInstance } from 'packages/cms/CMSList';
import { EASINGS } from 'packages/cms/animations';
import { CMSFilters } from './CMSFilter';

import type { CMSList } from 'packages/cms/CMSList';
import type { FormBlockElement } from '@finsweet/ts-utils';
import type { AnimationOptions } from 'packages/cms/animations';

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
const initFilters = (listInstance: CMSList) => {
  const instanceIndex = listInstance.getInstanceIndex(elementKey);

  const filters = document.querySelector(getSelector('element', 'filters', { instanceIndex }));
  if (!filters) return;

  const formBlock = filters.closest<FormBlockElement>(`.${FORM_CSS_CLASSES.formBlock}`);
  if (!formBlock) return;

  const emptyElement = document.querySelector<HTMLElement>(getSelector('element', 'empty', { instanceIndex }));
  emptyElement?.remove();

  const resultsElement = document.querySelector<HTMLElement>(getSelector('element', 'results', { instanceIndex }));

  const showQueryParams = filters.getAttribute(showQueryKey) === showQueryValues.true;

  const animationDuration = listInstance.getAttribute(durationKey);
  const animationEasing = listInstance.getAttribute(easingKey);

  const animationOptions: AnimationOptions = {
    easing: isKeyOf(animationEasing, EASINGS) ? animationEasing : undefined,
    duration: animationDuration ? parseFloat(animationDuration) / 200 : DEFAULT_ANIMATION_DURATION,
  };

  const filtersInstance = new CMSFilters(formBlock, listInstance, {
    emptyElement,
    resultsElement,
    showQueryParams,
    animationOptions,
  });

  return filtersInstance;
};
