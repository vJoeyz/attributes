import type { CMSList } from '$cms/cmscore/src';
import type { TabsElement } from '@finsweet/ts-utils';

export interface PopulateData {
  listInstances: CMSList[];
  tabsElement: TabsElement;
}
