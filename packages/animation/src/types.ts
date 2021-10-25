import type { AnimationListOptions, MotionKeyframesDefinition } from 'motion';
import type { easings } from './functions';

export interface AnimationProps {
  keyframes: MotionKeyframesDefinition;
  initialStyles: {
    [key: string]: string;
  };
}

type AnimationOptions = Pick<AnimationListOptions, 'duration' | 'easing'> & { stagger?: number };
type AnimationBase<T> = (element: HTMLElement | HTMLElement[], options?: T & AnimationOptions) => Promise<void>;

type AnimationIn = AnimationBase<{ target?: Element; anchor?: Element }>;
type AnimationOut = AnimationBase<{ remove?: boolean }>;

export type AnimationFunctions = { animateIn: AnimationIn; animateOut: AnimationOut };
export type Animation = AnimationFunctions & { options?: AnimationOptions };

export type AnimationsObject = Readonly<
  Record<
    'fade' | 'slide-up' | 'slide-down' | 'slide-right' | 'slide-left' | 'grow' | 'shrink' | 'spin',
    AnimationFunctions
  >
>;

export type Easings = typeof easings;

export type AnimationImport = Promise<
  | {
      animations: AnimationsObject;
      easings: Easings;
    }
  | undefined
>;
