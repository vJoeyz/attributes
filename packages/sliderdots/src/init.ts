import { cloneNode, SLIDER_CSS_CLASSES } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';

import type { SliderElement, SlideElement, SliderDotElement } from '@finsweet/ts-utils';

// Constants destructuring
const {
  remove: { key: removeKey, values: removeValues },
} = ATTRIBUTES;

const { slider: sliderCSSClass, slide: slideCSSClass, sliderDot: sliderDotCSSClass } = SLIDER_CSS_CLASSES;

/**
 * Inits the custom slider dots.
 */
export function init(): void {
  const sliders = document.querySelectorAll<SliderElement>(`.${sliderCSSClass}`);
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const slides = slider.querySelectorAll<SlideElement>(`.${slideCSSClass}`);
    const dots = slider.querySelectorAll<SliderDotElement>(`.${sliderDotCSSClass}`);

    slides.forEach((slide, index) => {
      const dotContentElements = slide.querySelectorAll(getSelector('element', 'content'));
      const dot = dots[index];

      dotContentElements.forEach((element) => {
        const mustRemove = element.getAttribute(removeKey) === removeValues.true;

        const elementToAppend = mustRemove ? element : cloneNode(element);
        if (elementToAppend instanceof HTMLElement) elementToAppend.style.pointerEvents = 'none';

        dot.appendChild(elementToAppend);
      });
    });
  });
}
