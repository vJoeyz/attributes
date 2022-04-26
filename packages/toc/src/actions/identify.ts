import slugify from 'slugify';

/**
 * Ensures a heading element has an id and returns its value.
 * @param headingElement
 * @returns The id value.
 */
export const identifyHeadingElement = (headingElement: HTMLHeadingElement) => {
  if (headingElement.id) return headingElement.id;

  const { textContent } = headingElement;
  if (!textContent) return;

  const id = slugify(textContent, { lower: true });
  headingElement.id = id;

  return id;
};
