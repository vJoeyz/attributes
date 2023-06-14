import { awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';
import type { SliderElement } from '@finsweet/ts-utils';
import { isNotEmpty, SLIDER_CSS_CLASSES } from '@finsweet/ts-utils';

import { createSliderDots } from './factory';
import { getElementSelector } from './utils/selectors';

/**
 * Inits the custom slider dots.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  const sliders = [
    ...document.querySelectorAll<SliderElement>(`.${SLIDER_CSS_CLASSES.slider}${getElementSelector('slider')}`),
  ];

  const cleanups = (await Promise.all(sliders.map(createSliderDots))).filter(isNotEmpty);

  return {
    result: sliders,
    destroy() {
      for (const cleanup of cleanups) cleanup();
    },
  };
};
