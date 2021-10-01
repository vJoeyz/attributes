import { collectPageLinks } from './collect-links';
import { ATTRIBUTES } from './constants';
import { Elements, getElements, populatePaginationButtons } from './elements';
import { getStoredPageLinks, setStoredPageLinks } from './storage';

// Types
interface Params {
  buttonsSelector?: string;
  buttonsLimit?: number;
}

export type PageLinks = string[];
export interface ListData extends Elements {
  pageLinks: PageLinks;
}

/**
 * Inits the attribute.
 *
 * Auto init:
 * @param params The current `<script>` element.
 *
 * Programatic init:
 * @param params.param A global parameter.
 */
export const init = async (params?: HTMLOrSVGScriptElement | Params | null): Promise<void> => {
  let globalListsSelector: string | null | undefined;
  let buttonsLimit: number | undefined;

  if (params instanceof HTMLScriptElement || params instanceof SVGScriptElement) {
    globalListsSelector = params.getAttribute(ATTRIBUTES.buttons.key);

    const rawButtonsLimit = params.getAttribute(ATTRIBUTES.limit.key);
    if (rawButtonsLimit) buttonsLimit = parseInt(rawButtonsLimit);
    if (Number.isNaN(buttonsLimit)) buttonsLimit = 0;
  } else if (params) {
    globalListsSelector = params.buttonsSelector;
    ({ buttonsLimit } = params);
  }

  const elements = getElements(document, globalListsSelector);

  const listsData = await Promise.all(
    elements.map(async (data, index) => {
      // Make sure the list is paginated
      const { nextButton, previousButton } = data;
      const navButton = nextButton || previousButton;
      if (!navButton) return;

      // Check if the links have already been fetched
      let pageLinks = getStoredPageLinks(index);
      if (pageLinks) return { ...data, pageLinks };

      // If not, get all page links
      const { searchParams, origin, pathname } = new URL(navButton.href);
      const [pageQueryKey] = [...searchParams.keys()];
      if (!pageQueryKey) return;

      pageLinks = await collectPageLinks(`${origin}${pathname}?${pageQueryKey}=1`, index, globalListsSelector);

      setStoredPageLinks(index, pageLinks);

      return { ...data, pageLinks };
    })
  );

  for (const data of listsData) if (data) populatePaginationButtons(data, buttonsLimit);
};
