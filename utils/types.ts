import type { CollectionListWrapperElement } from '@finsweet/ts-utils';
import type { CMSList } from 'packages/cms/CMSList';

/**
 * Window object.
 */
declare global {
  interface Window {
    fsAttributes: {
      cms?: {
        listElements?: CollectionListWrapperElement[];
        lists?: CMSList[];
      };
      [key: string]: unknown;
    };
  }
}
