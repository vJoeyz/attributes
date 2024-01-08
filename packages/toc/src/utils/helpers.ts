import { HEADING_LEVEL_REGEXP } from './constants';

/**
 * Extracts the heading level from a heading tag.
 * @param value The heading tag.
 *
 * @example ```
 * extractHeadingLevel('h2') // 2
 * extractHeadingLevel('h5') // 5
 * extractHeadingLevel('5') // 5
 * extractHeadingLevel('hh') // undefined
 * ```
 *
 */
export const extractHeadingLevel = (value: string) => {
  const rawLevel = value.match(HEADING_LEVEL_REGEXP)?.[0];
  if (!rawLevel) return;

  const level = parseInt(rawLevel);
  if (isNaN(level)) return;

  return level;
};

export type ScrollContext = {
  linkElement: HTMLElement;
  interaction: 'fromTop' | 'fromBottom';
};

/**
 * Scrolls the link element into view within the closest scrollable parent.
 * @param context The context containing the link element, interaction type, and current state.
 */
export const scrollLinkIntoView = (context: ScrollContext): void => {
  const { linkElement, interaction } = context;

  let scrollableParent = linkElement.parentElement;
  while (scrollableParent && !isElementScrollable(scrollableParent)) {
    scrollableParent = scrollableParent.parentElement;
  }

  if (!scrollableParent) {
    return;
  }

  // Set the scroll behavior to smooth
  scrollableParent.style.scrollBehavior = 'smooth';

  const linkRect = linkElement.getBoundingClientRect();
  const parentRect = scrollableParent.getBoundingClientRect();
  const parentScrollTop = scrollableParent.scrollTop;
  const offsetTop = linkElement.offsetTop - parentScrollTop;

  // Calculate the 30% offset positions
  const topOffsetPosition = parentRect.height * 0.3;
  const bottomOffsetPosition = parentRect.height - parentRect.height * 0.3;

  // Check if element is already within the desired view
  if (offsetTop > topOffsetPosition && offsetTop < bottomOffsetPosition) {
    // The element is already in view with the desired offset, no need to scroll
    return;
  }

  let scrollPosition: number;
  if (interaction === 'fromTop') {
    scrollPosition = linkElement.offsetTop - parentRect.height * 0.3;
  } else {
    // 'fromBottom'
    scrollPosition = linkElement.offsetTop - parentRect.height + (linkRect.height + parentRect.height * 0.3);
  }

  // Scroll the parent to the desired position
  scrollableParent.scrollTop = scrollPosition;
};

/**
 * Checks if an element is scrollable.
 * @param element The element to check.
 * @returns true if the element is scrollable, otherwise false.
 */
export const isElementScrollable = (element: HTMLElement): boolean => {
  const { overflowY } = window.getComputedStyle(element);

  return overflowY === 'scroll' || overflowY === 'auto';
};
