import { WEBFLOW_CURRENT_CSS_CLASS } from '$utils/webflow';
import { cloneNode, getCollectionElements } from '@finsweet/ts-utils';
import { getSelector } from './constants';
import type { ListData } from './init';

// Types
export interface Elements {
  buttonTemplate: HTMLAnchorElement;
  collectionListWrapper: HTMLDivElement;
  nextButton?: HTMLAnchorElement | null;
  previousButton?: HTMLAnchorElement | null;
}

/**
 * Collects the needed elemenets in the specified page.
 * @param page The page where to query the elements, defaults to the main document.
 */
export const getElements = (page: Document = document, globalButtonsSelector?: string | null): Elements[] => {
  const elements: Elements[] = [];

  const buttonsTemplates = page.querySelectorAll<HTMLElement>(
    `${getSelector('element', 'button', { operator: 'prefixed' })}${
      globalButtonsSelector ? `, ${globalButtonsSelector}` : ''
    }`
  );

  buttonsTemplates.forEach((buttonTemplate, index) => {
    // Make sure the buttons are `<a>` elements and the Collection List is not duplicated
    const collectionListWrapper = getCollectionElements(buttonTemplate, 'wrapper');

    if (
      !(buttonTemplate instanceof HTMLAnchorElement) ||
      !collectionListWrapper ||
      elements.find((data) => collectionListWrapper === data.collectionListWrapper)
    ) {
      return;
    }

    const nextButton = getCollectionElements(collectionListWrapper, 'next');
    const previousButton = getCollectionElements(collectionListWrapper, 'previous');

    elements[index] = { buttonTemplate, collectionListWrapper, nextButton, previousButton };
  });

  return elements;
};

export const populatePaginationButtons = (
  { buttonTemplate, nextButton, previousButton, pageLinks }: ListData,
  buttonsLimit?: number
): void => {
  const wrapper = buttonTemplate.parentElement;
  if (!wrapper) return;

  buttonTemplate.remove();

  if (!pageLinks.length) return;

  let lastAppendedButton: HTMLAnchorElement | undefined;

  // Get the current page index
  let currentPageIndex = !window.location.search.includes('_page')
    ? 0
    : pageLinks.findIndex((pageLink) => pageLink === window.location.href);

  if (currentPageIndex === -1) currentPageIndex = 0;

  // Populate the buttons
  for (let index = pageLinks.length - 1; index >= 0; index--) {
    const pageLink = pageLinks[index];

    const newButton = cloneNode(buttonTemplate);
    newButton.href = pageLink;

    newButton.textContent = `${index + 1}`;

    if (index === currentPageIndex) {
      newButton.removeAttribute('href');
      newButton.setAttribute('aria-current', 'page');
      newButton.classList.add(WEBFLOW_CURRENT_CSS_CLASS);
    }

    if (lastAppendedButton) wrapper.insertBefore(newButton, lastAppendedButton);
    else if (nextButton) wrapper.insertBefore(newButton, nextButton);
    else if (previousButton?.nextElementSibling) wrapper.insertBefore(newButton, previousButton.nextElementSibling);
    else wrapper.appendChild(newButton);

    lastAppendedButton = newButton;
  }
};
