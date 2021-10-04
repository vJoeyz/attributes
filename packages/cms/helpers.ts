import { getCollectionElements } from '@finsweet/ts-utils';

import type { CollectionListWrapperElement } from '@finsweet/ts-utils';

/**
 * Queries `Collection List Wrapper` elements and makes sure they are unique.
 * @param selectors The selectors used for the query.
 * @returns A unique list of `Collection List Wrapper` elements.
 */
export const getCollectionListWrappers = (
  selectors: Array<string | null | undefined>
): CollectionListWrapperElement[] => {
  // Make sure the selectors are valid.
  selectors = selectors.filter((selector) => selector);

  const referenceElements = [...document.querySelectorAll<HTMLElement>(selectors.join(', '))];

  const collectionListWrappers = referenceElements.reduce<CollectionListWrapperElement[]>(
    (wrappers, referenceElement) => {
      if (!referenceElement) return wrappers;

      const collectionListWrapper = getCollectionElements(referenceElement, 'wrapper');
      if (!collectionListWrapper || wrappers.includes(collectionListWrapper)) return wrappers;

      wrappers.push(collectionListWrapper);

      return wrappers;
    },
    []
  );

  return collectionListWrappers;
};
