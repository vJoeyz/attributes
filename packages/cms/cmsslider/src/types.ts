import type { SliderElement } from '@finsweet/ts-utils';

import type { CMSList } from '$cms/cmscore/src';

export interface PopulateData {
  listInstances: CMSList[];
  slider: SliderElement;
}
