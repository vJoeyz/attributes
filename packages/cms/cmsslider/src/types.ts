import type { CMSList } from '$cms/cmscore/src';
import type { SliderElement } from '@finsweet/ts-utils';

export interface PopulateData {
  listInstances: CMSList[];
  slider: SliderElement;
}
