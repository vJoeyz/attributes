import type { CollectionListWrapperElement } from '@finsweet/ts-utils';
import type { AnimationImport } from 'packages/animation/src/types';

import type { CMSList } from '$cms/cmscore/src';
import type { CMSCoreImport } from '$cms/cmscore/src/types';
import type { CMSFilters } from '$cms/cmsfilter/src/components/CMSFilters';

export type FsAttributesCallback = [string, (value: unknown) => void];

type FsAttributesBase = {
  animationImport?: AnimationImport;

  push: (...args: FsAttributesCallback[]) => void;

  cms: {
    coreVersion?: string;
    coreImport?: CMSCoreImport;
    listElements?: CollectionListWrapperElement[];
    listInstances?: CMSList[];
    filtersInstances?: CMSFilters[];
  };
};

export interface FsAttributeInit<T = unknown> {
  version?: string;
  init?: () => T | Promise<T>;
  loading?: Promise<T>;
  resolve?: (value: T) => void;
}

type FsAttributesInit = {
  [key: string]: FsAttributeInit;
};

export type FsAttributes = FsAttributesBase & FsAttributesInit;

/**
 * Window object.
 */
declare global {
  interface Window {
    fsAttributes: FsAttributes;
    FsAttributes: FsAttributes;
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
