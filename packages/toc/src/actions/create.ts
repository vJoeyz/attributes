import slugify from 'slugify';

import { ZERO_WIDTH_CHARS_REGEXP } from '../utils/constants';

/**
 * Creates a wrapper element for a heading and identifies it.
 * @param headingElement
 * @returns The new wrapper element.
 */
export const createHeadingWrapper = (headingElement: HTMLHeadingElement) => {
  const headingWrapper = document.createElement('div');

  const { id, textContent } = headingElement;
  const trimmedTextContent = textContent?.trim().replace(ZERO_WIDTH_CHARS_REGEXP, '');

  if (!id && !trimmedTextContent) return;

  if (id) {
    headingWrapper.id = id;
    headingElement.removeAttribute('id');
  } else if (trimmedTextContent) {
    headingWrapper.id = slugify(trimmedTextContent, { lower: true, strict: true });
  }

  return headingWrapper;
};
