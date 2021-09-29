import { collectPageLinks } from './collect-links';
import { ATTRIBUTES } from './constants';
import { Elements, getElements, populatePaginationButtons } from './elements';
import { getStoredPageLinks, setStoredPageLinks } from './storage';

// Types
interface Params {
  buttonsSelector?: string;
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
  let globalButtonsSelector: string | null | undefined;

  if (params instanceof HTMLScriptElement || params instanceof SVGScriptElement) {
    globalButtonsSelector = params.getAttribute(ATTRIBUTES.buttons.key);
  } else if (params) {
    globalButtonsSelector = params.buttonsSelector;
  }

  const elements = getElements(document, globalButtonsSelector);

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

      pageLinks = await collectPageLinks(`${origin}${pathname}?${pageQueryKey}=1`, index, globalButtonsSelector);

      setStoredPageLinks(index, pageLinks);

      return { ...data, pageLinks };
    })
  );

  for (const data of listsData) if (data) populatePaginationButtons(data);
};
