import { getCMSElementSelector } from '@finsweet/attributes-utils';
import type { CollectionItemElement } from '@finsweet/ts-utils';

/**
 * @returns A parent CMS Item element, if existing.
 * @param element
 */
export const getCMSItemWrapper = (element: HTMLElement) =>
  element.closest<CollectionItemElement>(getCMSElementSelector('item')) || undefined;
