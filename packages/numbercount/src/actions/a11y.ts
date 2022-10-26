import { ARIA_DESCRIPTION, ARIA_ROLEDESCRIPTION, ARIA_ROLE_KEY, ARIA_ROLE_VALUES } from '$global/constants/a11ty';

/**
 * Sets A11Y attributes to the number count element.
 * @param numberElement
 * @param start
 * @param end
 */
export const setNumberCountA11Y = (numberElement: Element, start: number, end: number) => {
  numberElement.setAttribute(ARIA_ROLE_KEY, ARIA_ROLE_VALUES.marquee);

  const description = `Number count animation from ${start} to ${end}`;

  if (!numberElement.hasAttribute(ARIA_ROLEDESCRIPTION)) {
    numberElement.setAttribute(ARIA_ROLEDESCRIPTION, description);
  }

  if (!numberElement.hasAttribute(ARIA_DESCRIPTION)) {
    numberElement.setAttribute(ARIA_DESCRIPTION, description);
  }
};
