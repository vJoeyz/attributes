import { FORM_CSS_CLASSES, isNotEmpty } from '@finsweet/ts-utils';
import { createCMSListInstance } from 'packages/cms/CMSList';
import { getCollectionListWrappers } from 'packages/cms/helpers';
import { CMSFilters } from './CMSFilter';
import { ATTRIBUTES, getSelector } from './constants';

import type { CMSList } from 'packages/cms/CMSList';
import type { FormBlockElement } from '@finsweet/ts-utils';

// Types
interface Params {
  listsSelector?: string;
}

// Constants destructuring
const {
  element: { key: elementKey },
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

  const filtersInstance = new CMSFilters(formBlock, emptyElement, listInstance);

  return filtersInstance;
};
