import type { SlideElement, SliderDotElement, SliderElement } from '@finsweet/ts-utils';
import { cloneNode, SLIDER_CSS_CLASSES } from '@finsweet/ts-utils';

import { hasAttributeValue, queryElement } from '../utils/selectors';
import type { DotsRelationship } from '../utils/types';

const { slide: slideCSSClass, sliderDot: sliderDotCSSClass } = SLIDER_CSS_CLASSES;

/**
 * Populates all the custom slider dots.
 * @param slider The `SliderElement`.
 * @param customSliderNav The custom Slider nav element.
 *
 * @returns A {@link DotsRelationship} array.
 */
export const populateSliderDots = (slider: SliderElement, customSliderNav: HTMLElement): DotsRelationship => {
  const dotsRelationship: DotsRelationship = [];

  const slides = slider.querySelectorAll<SlideElement>(`.${slideCSSClass}`);
  const dots = slider.querySelectorAll<SliderDotElement>(`.${sliderDotCSSClass}`);

  slides.forEach((slide, index) => {
    const dot = dots[index];
    if (!dot) return;

    dot.style.display = 'none';

    const customDotElement = queryElement<HTMLElement>('content', { scope: slide });
    if (!customDotElement) return;

    const mustRemove = hasAttributeValue(customDotElement, 'remove', 'true');

    const customDot = mustRemove ? customDotElement : cloneNode(customDotElement);

    customSliderNav.appendChild(customDot);

    dotsRelationship.push({ dot, customDot });
  });

  return dotsRelationship;
};
