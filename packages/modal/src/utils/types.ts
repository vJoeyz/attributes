import type { AnimationFunctions, Easings } from '@finsweet/attributes-utils';

import type { DISPLAY_PROPERTIES } from './constants';

export type AnimationDisplayProperty = (typeof DISPLAY_PROPERTIES)[number];

export interface AnimationSettings {
  actions: AnimationFunctions;
  duration?: number;
  easing?: Easings[number];
  display?: AnimationDisplayProperty;
}
