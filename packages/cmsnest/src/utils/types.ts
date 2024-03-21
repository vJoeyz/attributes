import type { CMSList } from '@finsweet/attributes-cmscore';

export type NestSource = {
  listInstance: CMSList;
  emptyElement: HTMLElement | null;
};

export type NestSources = Map<string, NestSource>;

export type ManualNestTargets = Map<
  string,
  {
    nestTarget: HTMLElement;
    slugs: string[];
  }
>;
export type ExternalNestTargets = Map<string, HTMLElement>;
