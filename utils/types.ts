import type { CollectionListWrapperElement } from '@finsweet/ts-utils';
import type { AnimationImport } from 'packages/animation/src/types';
import type { CMSList } from 'packages/cms/cmscore/src';
import type { CMSCoreImport } from 'packages/cms/cmscore/src/types';

/**
 * Window object.
 */
declare global {
  interface Window {
    fsAttributes: {
      animationImport?: AnimationImport;

      cms: {
        coreImport?: CMSCoreImport;
        listElements?: CollectionListWrapperElement[];
        lists?: CMSList[];
      };

      [key: string]: unknown;
    };
  }
}

/**
 * Global params.
 */
export interface GlobalAttributeParams {
  /**
   * Defines if the `<script>` should prevent automatically loading the library.
   * Useful for cases where a JS developer whants to programatically init the library.
   */
  preventsLoad: boolean;
}
