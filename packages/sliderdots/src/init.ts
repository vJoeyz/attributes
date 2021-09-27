import { SLIDER_COMPONENT_CSS_CLASSES } from '$utils/webflow';
import { cloneNode } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';

// Constants destructuring
const {
  remove: { key: removeKey, values: removeValues },
} = ATTRIBUTES;

const { slider: sliderCSSClass, slide: slideCSSClass, sliderDot: sliderDotCSSClass } = SLIDER_COMPONENT_CSS_CLASSES;

/**
 * Inits the custom slider dots.
 */
export function init(): void {
  const sliders = document.querySelectorAll<HTMLDivElement>(`.${sliderCSSClass}`);

  for (const slider of sliders) {
    const slides = slider.querySelectorAll<HTMLDivElement>(`.${slideCSSClass}`);
    const dots = slider.querySelectorAll<HTMLDivElement>(`.${sliderDotCSSClass}`);

    slides.forEach((slide, index) => {
      const dotContentElements = slide.querySelectorAll(getSelector('element', 'content'));

      dotContentElements.forEach((element) => {
        const mustRemove = element.getAttribute(removeKey) === removeValues.true;

        const elementToAppend = mustRemove ? element : cloneNode(element);
        if (elementToAppend instanceof HTMLElement) elementToAppend.style.pointerEvents = 'none';

        dots[index].appendChild(elementToAppend);
      });
    });
  }
}
