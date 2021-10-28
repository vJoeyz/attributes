import { animate, stagger as staggerDelay } from 'motion';

import type { AnimationFunctions, AnimationProps } from './types';

/**
 * Creates a new Animation.
 * @param props The animaiton props.
 * @returns A new `in` and `out` Animation functions.
 */
export const createAnimation = (props: AnimationProps): AnimationFunctions => {
  /**
   * In animation.
   * @param elements The element to animate.
   * @param options.target If defined, the element will be appended to the target.
   * @param options.anchor A child of the target. If defined, the element will be appended right before this anchor element.
   * @param options.animationOptions The main options of the animation. Reference: {@link [Motion One](https://motion.dev/dom/animate#options)}.
   * @returns An awaitable promise.
   */
  const animateIn: AnimationFunctions['animateIn'] = async (elements, options = {}) => {
    const { target, anchor, stagger, ...animationOptions } = options;
    const { keyframes, initialStyles } = props;

    if (!Array.isArray(elements)) elements = [elements];

    for (const element of elements) {
      element.style.display = '';
      Object.assign(element.style, initialStyles);

      if (target && anchor) target.insertBefore(element, anchor);
      else if (target) target.appendChild(element);
    }

    const { finished } = animate(elements, keyframes, {
      delay: stagger ? staggerDelay(stagger) : undefined,
      ...animationOptions,
    });

    return await finished;
  };

  /**
   * Out animation.
   * @param elements The element to animate.
   * @param options.remove If defined, the element will be removed from the DOM after the animation ends.
   * @param options.animationOptions The main options of the animation. Reference: {@link [Motion One](https://motion.dev/dom/animate#options)}.
   * @returns An awaitable promise.
   */
  const animateOut: AnimationFunctions['animateOut'] = async (elements, options = {}) => {
    const { remove, stagger, ...animationOptions } = options;
    const { keyframes } = props;

    if (!Array.isArray(elements)) elements = [elements];

    elements = elements.filter((element) => document.body.contains(element));

    const { finished } = animate(elements, keyframes, {
      ...animationOptions,
      delay: stagger ? staggerDelay(stagger) : undefined,
      direction: 'reverse',
    });

    await finished;

    for (const element of elements) {
      if (remove) element.remove();
      else element.style.display = 'none';
    }
  };

  return { animateIn, animateOut };
};
