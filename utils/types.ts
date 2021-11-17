import type { CollectionListWrapperElement } from '@finsweet/ts-utils';
import type { AnimationImport } from 'packages/animation/src/types';
import type { CMSList } from '$cms/cmscore/src';
import type { CMSCoreImport } from '$cms/cmscore/src/types';
import type { CMSFilters } from '$cms/cmsfilter/src/CMSFilters';

/**
 * Window object.
 */
declare global {
  interface Window {
    fsAttributes: {
      animationImport?: AnimationImport;

      cms: {
        coreVersion?: string;
        coreImport?: CMSCoreImport;
        listElements?: CollectionListWrapperElement[];
        lists?: CMSList[];
        filtersInstances?: CMSFilters[];
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
