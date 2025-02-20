import { animations } from '@finsweet/attributes-utils';

import { getAttribute } from '../utils/selectors';
import type { AnimationSettings } from '../utils/types';

/**
 * Extracts the animation settings of an element.
 * @param element
 */
export const getAnimationSettings = (element: Element): AnimationSettings => {
  const animationName = getAttribute(element, 'animation', { filterInvalid: true });
  const actions = animationName ? animations[animationName] : animations.fade;

  const animationDuration = getAttribute(element, 'duration');
  const duration = animationDuration ? parseFloat(animationDuration) : undefined;

  const easing = getAttribute(element, 'easing', { filterInvalid: true });
  const display = getAttribute(element, 'display', { filterInvalid: true });

  return { actions, duration, easing, display };
};
