import type { CollectionListWrapperElement } from '@finsweet/ts-utils';
import type { AnimationsObject, Easings } from 'packages/animation/src/types';
import type { CMSList } from 'packages/cms/CMSList';

export type FsAnimation = Promise<
  | {
      animations: AnimationsObject;
      easings: Easings;
    }
  | undefined
>;

/**
 * Window object.
 */
declare global {
  interface Window {
    fsAttributes: {
      animationImport?: FsAnimation;
      cms?: {
        listElements?: CollectionListWrapperElement[];
        lists?: CMSList[];
      };
      [key: string]: unknown;
    };
  }
}
