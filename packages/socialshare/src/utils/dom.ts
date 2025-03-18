import { CMS_CSS_CLASSES, type CollectionItemElement } from '@finsweet/attributes-utils';

/**
 * @returns A parent CMS Item element, if existing.
 * @param element
 */
export const getCMSItemWrapper = (element: HTMLElement) =>
  element.closest<CollectionItemElement>(`.${CMS_CSS_CLASSES.item}`) || undefined;
