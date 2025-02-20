import type { AnimationFunctions, Easings } from '@finsweet/attributes-utils';

import type { SETTINGS } from './constants';

export type AnimationDisplayProperty = (typeof SETTINGS.display.values)[number];

export interface AnimationSettings {
  actions: AnimationFunctions;
  duration?: number;
  easing?: Easings[number];
  display: AnimationDisplayProperty;
}
