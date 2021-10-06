import type { CMSList } from 'packages/cms/CMSList';

/**
 * Window object.
 */
declare global {
  interface Window {
    fsAttributes: {
      cms?: {
        lists?: CMSList[];
      };
      [key: string]: unknown;
    };
  }
}
