import { FORM_CSS_CLASSES, isNotEmpty } from '@finsweet/ts-utils';
import { createCMSListInstance } from 'packages/cms/CMSList';
import { getCollectionListWrappers } from 'packages/cms/helpers';
import { CMSFilters } from './CMSFilter';
import { ATTRIBUTES, getSelector } from './constants';

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

  for (const listInstance of listInstances) {
    const instanceIndex = listInstance.getInstanceIndex(elementKey);

    const filters = document.querySelector(getSelector('element', 'filters', { instanceIndex }));
    if (!filters) continue;

    const formBlock = filters.closest<FormBlockElement>(`.${FORM_CSS_CLASSES.formBlock}`);
    if (!formBlock) continue;

    const emptyElement = document.querySelector<HTMLElement>(getSelector('element', 'empty', { instanceIndex }));
    emptyElement?.remove();

    const filtersInstance = new CMSFilters(formBlock, emptyElement, listInstance);
    console.log(filtersInstance);
  }
};
