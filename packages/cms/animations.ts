import { animate } from 'motion';

import type { AnimationListOptions, MotionKeyframesDefinition } from 'motion';

// Types
export type AnimationOptions = Pick<AnimationListOptions, 'duration' | 'easing'>;
type AnimationBase<T> = (element: HTMLElement, options?: T & AnimationOptions) => Promise<void>;

type AnimationIn = AnimationBase<{ target?: Element; anchor?: Element }>;
type AnimationOut = AnimationBase<{ remove?: boolean }>;

export interface Animation {
  in: AnimationIn;
  out: AnimationOut;
}

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
const createAnimation = (props: AnimationProps) => {
  /**
   * In animation.
   * @param element The element to animate.
   * @param options.target If defined, the element will be appended to the target.
   * @param options.anchor A child of the target. If defined, the element will be appended right before this anchor element.
   * @param options.animationOptions The main options of the animation. Reference: {@link [Motion One](https://motion.dev/dom/animate#options)}.
   * @returns An awaitable promise.
   */
  const animationIn: AnimationIn = async (element, options = {}) => {
    const { target, anchor, ...animationOptions } = options;
    const { keyframes, initialStyles } = props;

    Object.assign(element.style, initialStyles);

    if (target && anchor) anchor.insertBefore(element, anchor);
    else if (target) target.appendChild(element);

    const { finished } = animate(element, keyframes, { ...animationOptions });

    return await finished;
  };

  /**
   * Out animation.
   * @param element The element to animate.
   * @param options.remove If defined, the element will be removed from the DOM after the animation ends.
   * @param options.animationOptions The main options of the animation. Reference: {@link [Motion One](https://motion.dev/dom/animate#options)}.
   * @returns An awaitable promise.
   */
  const animationOut: AnimationOut = async (element, options = {}) => {
    const { remove, ...animationOptions } = options;
    const { keyframes } = props;

    const { finished } = animate(element, keyframes, { ...animationOptions, direction: 'reverse' });

    await finished;

    if (remove) element.remove();
  };

  return [animationIn, animationOut];
};

/**
 * Fade
 */
const [fadeIn, fadeOut] = createAnimation({ keyframes: { opacity: 1 }, initialStyles: { opacity: '0' } });

/**
 * Slide Up
 */
const [slideUpIn, slideUpOut] = createAnimation({
  keyframes: { y: [100, 0], opacity: 1 },
  initialStyles: { transform: 'translateY(100px)', opacity: '0' },
});

/**
 * Slide Down
 */
const [slideDownIn, slideDownOut] = createAnimation({
  keyframes: { y: [-100, 0], opacity: 1 },
  initialStyles: { transform: 'translateY(-100px)', opacity: '0' },
});

/**
 * Contains all animation functions.
 */
export const ANIMATIONS: {
  [key: string]: Animation;
} = {
  fade: {
    in: fadeIn,
    out: fadeOut,
  },
  'slide-up': {
    in: slideUpIn,
    out: slideUpOut,
  },
  'slide-down': {
    in: slideDownIn,
    out: slideDownOut,
  },
} as const;
