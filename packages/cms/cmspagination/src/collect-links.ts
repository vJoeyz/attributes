import { getElements } from './elements';

import type { PageLinks } from './init';
import type { PaginationButtonElement } from '@finsweet/ts-utils';

/**
 * DOM Parser to parse html strings.
 */
const domParser = new DOMParser();

/**
 * Collects all page links from a Collection List.
 * @param href The next button element.
 * @param index The index of the Collection List.
 * @param globalButtonsSelector
 * @returns
 */
export const collectPageLinks = async (
  href: string,
  index: number,
  globalButtonsSelector?: string | null
): Promise<PageLinks> => {
  const pageLinks: PageLinks = [];

  /**
   * Loads the items from the specified URL.
   * @param nextButton
   */
  const loadPage = async ({ href }: PaginationButtonElement | { href: string }) => {
    const response = await fetch(href);
    const rawPage = await response.text();

    const page = domParser.parseFromString(rawPage, 'text/html');

    const { nextButton } = getElements(page, globalButtonsSelector)[index];

    if (nextButton && !pageLinks.includes(nextButton.href)) {
      pageLinks.push(nextButton.href);
      await loadPage(nextButton);
    }
  };

  pageLinks.push(href);
  await loadPage({ href });

  return pageLinks;
};
