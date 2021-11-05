import type { CMSList } from '$cms/cmscore/src';

interface CollectionToNest {
  listInstance: CMSList;
  emptyElement: HTMLElement | null;
}

export type CollectionsToNest = Map<string, CollectionToNest>;

export type NestingTargets = Map<string, HTMLElement>;
