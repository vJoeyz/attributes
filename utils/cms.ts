import { WEBFLOW_CSS_CLASSES } from './webflow';

/**
 * This helper is intended to allow users setting the selectors to either the Collection List Wrapper or the Collection List elements.
 * This way there will never be any misunderstanding about the setup.
 * @param reference The element or selector of the element.
 * @param target The requested element.
 * @param page The page document.
 * @returns The specified collection element.
 */
export const getCollectionElement = (
  reference: string | Element,
  target: 'wrapper' | 'list',
  page: Document = document
): HTMLDivElement | null | undefined => {
  const referenceElement = typeof reference === 'string' ? page.querySelector<HTMLDivElement>(reference) : reference;
  if (!referenceElement) return;

  if (target === 'wrapper') {
    return referenceElement.closest<HTMLDivElement>(`.${WEBFLOW_CSS_CLASSES.collectionWrapper}`);
  }

  return (
    referenceElement.querySelector<HTMLDivElement>(`.${WEBFLOW_CSS_CLASSES.collectionList}`) ||
    referenceElement.closest<HTMLDivElement>(`.${WEBFLOW_CSS_CLASSES.collectionList}`)
  );
};
