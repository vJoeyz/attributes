import { animate, stagger as staggerDelay } from 'motion';

import type { AnimationListOptions, MotionKeyframesDefinition } from 'motion';

// Types
export type AnimationOptions = Pick<AnimationListOptions, 'duration' | 'easing'> & { stagger?: number };
type AnimationBase<T> = (element: HTMLElement | HTMLElement[], options?: T & AnimationOptions) => Promise<void>;

type AnimationIn = AnimationBase<{ target?: Element; anchor?: Element }>;
type AnimationOut = AnimationBase<{ remove?: boolean }>;

type AnimationFunctions = { animateIn: AnimationIn; animateOut: AnimationOut };
export type Animation = AnimationFunctions & { options?: AnimationOptions };

interface AnimationProps {
  keyframes: MotionKeyframesDefinition;
  initialStyles: {
    [key: string]: string;
  };
}

// Constants
export const EASINGS = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'] as const;

/**
 * Creates a new Animation.
 * @param props The animaiton props.
 * @returns A new `in` and `out` Animation functions.
 */
const createAnimation = (props: AnimationProps): AnimationFunctions => {
  /**
   * In animation.
   * @param elements The element to animate.
   * @param options.target If defined, the element will be appended to the target.
   * @param options.anchor A child of the target. If defined, the element will be appended right before this anchor element.
   * @param options.animationOptions The main options of the animation. Reference: {@link [Motion One](https://motion.dev/dom/animate#options)}.
   * @returns An awaitable promise.
   */
  const animateIn: AnimationIn = async (elements, options = {}) => {
    const { target, anchor, stagger, ...animationOptions } = options;
    const { keyframes, initialStyles } = props;

    if (!Array.isArray(elements)) elements = [elements];

    for (const element of elements) {
      element.style.display = '';
      Object.assign(element.style, initialStyles);

      if (target && anchor) anchor.insertBefore(element, anchor);
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
  const animateOut: AnimationOut = async (elements, options = {}) => {
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

/**
 * Contains all animation functions.
 */
export const ANIMATIONS: {
  readonly [key: string]: AnimationFunctions;
} = {
  /**
   * Fade
   */
  fade: createAnimation({ keyframes: { opacity: [0, 1] }, initialStyles: { opacity: '0' } }),

  /**
   * Slide Up
   */
  'slide-up': createAnimation({
    keyframes: { y: [100, 0], opacity: [0, 1] },
    initialStyles: { transform: 'translateY(100px)', opacity: '0' },
  }),

  /**
   * Slide Down
   */
  'slide-down': createAnimation({
    keyframes: { y: [-100, 0], opacity: [0, 1] },
    initialStyles: { transform: 'translateY(-100px)', opacity: '0' },
  }),

  /**
   * Slide Right
   */
  'slide-right': createAnimation({
    keyframes: { x: [-100, 0], opacity: [0, 1] },
    initialStyles: { transform: 'translateX(-100px)', opacity: '0' },
  }),

  /**
   * Slide Left
   */
  'slide-left': createAnimation({
    keyframes: { x: [100, 0], opacity: [0, 1] },
    initialStyles: { transform: 'translateX(100px)', opacity: '0' },
  }),

  /**
   * Grow
   */
  grow: createAnimation({
    keyframes: { scale: [0, 1], opacity: [0, 1] },
    initialStyles: { transform: 'scale(0)', opacity: '0' },
  }),

  /**
   * Shrink
   */
  shrink: createAnimation({
    keyframes: { scale: [1.25, 1], opacity: [0, 1] },
    initialStyles: { transform: 'scale(1.25)', opacity: '0' },
  }),

  /**
   * Spin
   */
  spin: createAnimation({
    keyframes: { rotate: [900, 0], opacity: [0, 1] },
    initialStyles: { transform: 'rotate(900deg)', opacity: '0' },
  }),
} as const;
