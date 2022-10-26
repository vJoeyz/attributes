/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CollectionListWrapperElement } from '@finsweet/ts-utils';

import type { AnimationImport } from '$packages/animation/src/types';
import type { CMSList } from '$packages/cmscore';
import type { CMSCoreImport } from '$packages/cmscore/src/utils/types';
import type { CMSFilters } from '$packages/cmsfilter/src/components/CMSFilters';

type FsAttributesCallback =
  | [
      'cmsload' | 'cmsnest' | 'cmscombine' | 'cmsprevnext' | 'cmsslider' | 'cmssort' | 'cmstabs',
      (value: CMSList[]) => void
    ]
  | ['cmsfilter', (value: CMSFilters[]) => void];

type FsAttributesBase = {
  push: (...args: FsAttributesCallback[]) => void;
  destroy?: () => void;

  // TODO: Remove this after cmscore@1.9.0 has rolled out
  cms?: {
    coreVersion?: string;
    coreImport?: CMSCoreImport;
    listElements?: CollectionListWrapperElement[];
    listInstances?: CMSList[];
    filtersInstances?: CMSFilters[];
  };
};

interface FsAttributeInit<T = any> {
  version?: string;
  init?: (...args: any[]) => T | Promise<T>;
  loading?: Promise<T>;
  resolve?: (value: T) => void;
  destroy?: () => void;
}

type FsAttributesInit = {
  cmscore?: {
    version?: string;
    import?: CMSCoreImport;
    listInstances?: Map<CollectionListWrapperElement, CMSList>;
  };

  animation?: FsAttributeInit & {
    import?: AnimationImport;
  };

  support?: {
    import?: Promise<boolean>;
  };

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
