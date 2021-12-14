import type { CollectionListWrapperElement } from '@finsweet/ts-utils';
import type { AnimationImport } from 'packages/animation/src/types';
import type { CMSList } from '$cms/cmscore/src';
import type { CMSCoreImport } from '$cms/cmscore/src/types';
import type { CMSFilters } from '$cms/cmsfilter/src/components/CMSFilters';

type FsAttributes = {
  animationImport?: AnimationImport;

  cms: {
    coreVersion?: string;
    coreImport?: CMSCoreImport;
    listElements?: CollectionListWrapperElement[];
    listInstances?: CMSList[];
    filtersInstances?: CMSFilters[];
  };
};

type FsInitMethods = {
  [key: string]: {
    init?: () => unknown | Promise<unknown>;
  };
};

/**
 * Window object.
 */
declare global {
  interface Window {
    fsAttributes: FsAttributes & FsInitMethods;
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
