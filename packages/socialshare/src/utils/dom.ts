import { type CollectionItemElement, getCMSElementSelector } from '@finsweet/attributes-utils';

/**
 * @returns A parent CMS Item element, if existing.
 * @param element
 */
export const getCMSItemWrapper = (element: HTMLElement) =>
  element.closest<CollectionItemElement>(getCMSElementSelector('item')) || undefined;
