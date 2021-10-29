import { DEFAULT_LIST_ANIMATION_DURATION } from './constants';
import { importAnimations } from '$utils/import';
import { getObjectKeys, isKeyOf } from '@finsweet/ts-utils';

import type { CMSList } from '$cms/cmscore/src';

/**
 * Adds list animations to a {@link CMSList}.
 * @param listInstance The `CMSList` instance.
 * @param propKeys
 */
export const addListAnimation = async (
  listInstance: CMSList,
  { durationKey, easingKey }: { durationKey: string; easingKey: string }
) => {
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
      duration: animationDuration ? parseFloat(animationDuration) / 200 : DEFAULT_LIST_ANIMATION_DURATION,
    },
  };
};

/**
 * Adds item animations to a {@link CMSList}.
 * @param listInstance The `CMSList` instance.
 * @param propKeys
 */
export const addItemsAnimation = async (
  listInstance: CMSList,
  {
    animationKey,
    durationKey,
    easingKey,
    staggerKey,
  }: { animationKey: string; durationKey: string; easingKey: string; staggerKey: string }
) => {
  const animationsImport = await importAnimations();
  if (!animationsImport) return;

  const { animations, easings } = animationsImport;

  const animationName = listInstance.getAttribute(animationKey);
  const animationFunctions = isKeyOf(animationName, getObjectKeys(animations))
    ? animations[animationName]
    : animations.fade;

  const animationDuration = listInstance.getAttribute(durationKey);
  const animationEasing = listInstance.getAttribute(easingKey);
  const animationStagger = listInstance.getAttribute(staggerKey);

  listInstance.itemsAnimation = {
    ...animationFunctions,
    options: {
      easing: isKeyOf(animationEasing, easings) ? animationEasing : undefined,
      duration: animationDuration ? parseFloat(animationDuration) : undefined,
      stagger: animationStagger ? parseFloat(animationStagger) : undefined,
    },
  };
};
