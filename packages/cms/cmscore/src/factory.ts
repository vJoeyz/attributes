import { CMS_CSS_CLASSES, Debug, getCollectionElements } from '@finsweet/ts-utils';
import { CMSList } from './CMSList';

import type { CollectionListWrapperElement } from '@finsweet/ts-utils';

/**
 * Creates a new `CMSList` instance, making sure there are no already existing instances on the page.
 * @param referenceElement The `Collection List` reference element.
 * @returns A new `CMSList` instance, if instantiation was valid.
 */
export const createCMSListInstance = (referenceElement: HTMLElement): CMSList | undefined => {
  const wrapper = getCollectionElements(referenceElement, 'wrapper');

  if (!wrapper) {
    Debug.alert('The element is not a Collection List.', 'error');
    return;
  }

  const { fsAttributes } = window;

  fsAttributes.cms.lists ||= [];
  fsAttributes.cms.listElements ||= [
    ...document.querySelectorAll<CollectionListWrapperElement>(`.${CMS_CSS_CLASSES.wrapper}`),
  ];

  const { lists, listElements } = fsAttributes.cms;

  const pageIndex = listElements.indexOf(wrapper);
  if (pageIndex === -1) return;

  lists[pageIndex] ||= new CMSList(wrapper, { pageIndex });

  return lists[pageIndex];
};
