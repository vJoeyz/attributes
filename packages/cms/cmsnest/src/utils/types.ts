import type { CMSList } from '$cms/cmscore/src';

interface NestSource {
  listInstance: CMSList;
  emptyElement: HTMLElement | null;
}

export type NestSources = Map<string, NestSource>;

export type NestTargets = Map<string, HTMLElement>;
