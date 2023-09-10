import { type CollectionItemElement, getCMSElementSelector } from '@finsweet/attributes-utils';

export const getCMSItemWrapper = (element: HTMLElement) =>
  element.closest<CollectionItemElement>(getCMSElementSelector('item')) || undefined;
