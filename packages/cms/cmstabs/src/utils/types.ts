import type { TabsElement } from '@finsweet/ts-utils';

import type { CMSList } from '$cms/cmscore/src';

export interface PopulateData {
  listInstances: CMSList[];
  tabsElement: TabsElement;
}
