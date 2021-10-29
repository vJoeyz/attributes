import { ATTRIBUTES, getSelector } from './constants';

import type { PaginationButtonElement } from '@finsweet/ts-utils';
import type { CMSList } from '$cms/cmscore/src';

// Constants
const {
  element: { key: elementKey },
  loading: { key: loadingKey },
} = ATTRIBUTES;

/**
 * Prepares the pagination of a `CMSList` instance:
 * - Gets the pagination buttons.
 * - Gets the user's settings.
 * @param listInstance The `CMSList` instance.
 */
export const collectSettings = (
  listInstance: CMSList
):
  | {
      listInstance: CMSList;
      paginationNext: PaginationButtonElement;
      paginationPrevious: CMSList['paginationPrevious'];
      paginationNextTextNode: Node | null;
      originalNextText?: string | null;
      loadingText?: string | null;
      loader: HTMLElement | null;
      pageButtonTemplate?: Element | null;
    }
  | undefined => {
  const { paginationNext, paginationPrevious } = listInstance;

  if (!paginationNext) return;

  if (paginationPrevious) paginationPrevious.remove();

  const paginationNextTextNode = paginationNext.querySelector(getSelector('loading'));

  const originalNextText = paginationNextTextNode?.textContent;

  const loadingText = paginationNextTextNode?.getAttribute(loadingKey);

  const instanceIndex = listInstance.getInstanceIndex(elementKey);

  const pageButtonTemplate = paginationNext.parentElement?.querySelector<HTMLElement>(
    getSelector('element', 'pageButton', { operator: 'prefixed' })
  );

  const loader = document.querySelector<HTMLElement>(getSelector('element', 'loader', { instanceIndex }));
  if (loader) loader.style.display = 'none';

  return {
    listInstance,
    paginationNext,
    paginationPrevious,
    paginationNextTextNode,
    originalNextText,
    loadingText,
    loader,
    pageButtonTemplate,
  };
};
