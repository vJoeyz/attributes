import { ATTRIBUTES, DEFAULT_ANIMATION_DURATION } from './constants';
import { importAnimations } from '$utils/import';
import { isKeyOf } from '@finsweet/ts-utils';

import type { CMSList } from 'packages/cms/cmscore/src';

// Constants destructuring
const {
  duration: { key: durationKey },
  easing: { key: easingKey },
} = ATTRIBUTES;

/**
 * Adds animations to the `CMSList`.
 * @param listInstance The {@link CMSFilters} instance.
 */
export const addAnimation = async (listInstance: CMSList) => {
  const animationsImport = await importAnimations();
  if (!animationsImport) return;

  const {
    animations: { fade },
    easings,
  } = animationsImport;

  const animationDuration = listInstance.getAttribute(durationKey);
  const animationEasing = listInstance.getAttribute(easingKey);

  listInstance.listAnimation = {
    ...fade,
    options: {
      easing: isKeyOf(animationEasing, easings) ? animationEasing : undefined,
      duration: animationDuration ? parseFloat(animationDuration) / 200 : DEFAULT_ANIMATION_DURATION,
    },
  };
};
