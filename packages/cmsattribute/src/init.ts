import { CMS_CSS_CLASSES } from '@finsweet/ts-utils';
import { CMS_LOAD_ATTRIBUTE } from 'global/constants/attributes';
import type { CMSList } from 'packages/cmscore/src';

import { createCMSAttribute } from './factory';
import { ATTRIBUTES } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<void> => {
  const targets = [
    ...document.querySelectorAll<HTMLElement>(`[${ATTRIBUTES.field.key}]:not([${ATTRIBUTES.element.key}])`),
  ];

  for (const targetElement of targets) {
    const cmsListItem = targetElement.closest<HTMLElement>(`.${CMS_CSS_CLASSES.item}`) || null;

    createCMSAttribute(targetElement, cmsListItem);
  }

  const listInstances: CMSList[] = (await window.fsAttributes[CMS_LOAD_ATTRIBUTE]?.loading) || [];

  for (const { items } of listInstances) {
    for (const { element } of items) {
      const cmsItemTargets = [
        ...element.querySelectorAll<HTMLElement>(`[${ATTRIBUTES.field.key}]:not([${ATTRIBUTES.element.key}])`),
      ];

      for (const targetElement of cmsItemTargets) {
        createCMSAttribute(targetElement, element);
      }
    }
  }
};
