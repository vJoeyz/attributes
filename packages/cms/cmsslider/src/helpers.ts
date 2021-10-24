import type { SliderElement } from '@finsweet/ts-utils';

/**
 * Modifies the mask width.
 * This little trick is made on purpose to trigger the `maskChanged` callback in `webflow.js`,
 * which automatically rebuilds all the Slides + Dots logic.
 *
 * @param slider The `SliderElement`.
 * @returns A callback that restores the mutation.
 */
export const mutateSliderMask = ({ style, offsetWidth }: SliderElement) => {
  style.width = `${offsetWidth - 1}px`;

  return () => {
    style.width = '';
  };
};
