import { WEBFLOW_CSS_CLASSES } from '$utils/webflow';
import { cloneNode } from '@finsweet/ts-utils';
import { ATTRIBUTES } from './constants';

// Constants  destructuring
const {
  element: { key: elementKey, values: elementValues },
  remove: { key: removeKey, values: removeValues },
} = ATTRIBUTES;

/**
 * Inits the custom slider dots.
 */
export function init(): void {
  const sliders = document.querySelectorAll<HTMLDivElement>(`.${WEBFLOW_CSS_CLASSES.slider}`);

  for (const slider of sliders) {
    const slides = slider.querySelectorAll<HTMLDivElement>(`.${WEBFLOW_CSS_CLASSES.slide}`);
    const dots = slider.querySelectorAll<HTMLDivElement>(`.${WEBFLOW_CSS_CLASSES.sliderDot}`);

    slides.forEach((slide, index) => {
      const dotContentElements = slide.querySelectorAll(`[${elementKey}="${elementValues.content}"]`);

      dotContentElements.forEach((element) => {
        const mustRemove = element.getAttribute(removeKey) === removeValues.true;

        const elementToAppend = mustRemove ? element : cloneNode(element);
        if (elementToAppend instanceof HTMLElement) elementToAppend.style.pointerEvents = 'none';

        dots[index].appendChild(elementToAppend);
      });
    });
  }
}
