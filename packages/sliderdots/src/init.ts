import { SLIDER_CSS_CLASSES } from '@finsweet/ts-utils';
import type { SliderElement } from '@finsweet/ts-utils';

import { createSliderDots } from './factory';
import { ATTRIBUTE, getSelector } from './utils/constants';

/**
 * Inits the custom slider dots.
 */
export function init(): NodeListOf<HTMLDivElement> {
  const sliders = document.querySelectorAll<SliderElement>(
    `.${SLIDER_CSS_CLASSES.slider}${getSelector('element', 'slider', { operator: 'prefixed' })}`
  );

  for (const slider of sliders) createSliderDots(slider);

  window.fsAttributes[ATTRIBUTE].resolve?.(sliders);

  return sliders;
}
