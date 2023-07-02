import type { CMSItem } from '@finsweet/attributes-cmscore';
import {
  ARIA_ROLE_KEY,
  type SlideElement,
  SLIDER_CSS_CLASSES,
  type SliderMaskElement,
} from '@finsweet/attributes-utils';

import type { PopulateData } from '../utils/types';

/**
 * Creates a new `Slide` inside the Slider for each `Collection Item` of the lists.
 * @param populateData
 * @returns A `createSlidesFromItems` callback.
 */
export const populateSliderFromLists = ({
  listInstances,
  slider,
}: PopulateData): ((items: CMSItem[]) => void) | undefined => {
  const sliderMask = slider.querySelector<SliderMaskElement>(`.${SLIDER_CSS_CLASSES.sliderMask}`);
  const existingSlides = slider.querySelectorAll<SlideElement>(`.${SLIDER_CSS_CLASSES.slide}`);
  if (!sliderMask || !existingSlides.length) return;

  // Store the template CSS classes
  const slideCSS = existingSlides[0].classList.value;

  // Remove existing slides
  for (const slide of existingSlides) slide.remove();

  /**
   * Creates a new `Slide` for each `CMSItem`
   * @param items An array of `CMSItem` instances.
   */
  const createSlidesFromItems = (items: CMSItem[]) => {
    // Add a new Slide for each Collection Item
    for (const { element } of items) {
      element.removeAttribute(ARIA_ROLE_KEY);

      const newSlide = document.createElement('div');
      newSlide.setAttribute('class', slideCSS);

      newSlide.appendChild(element);
      sliderMask.appendChild(newSlide);
    }
  };

  // Populate the items
  for (const { wrapper, items } of listInstances) {
    // Create slides
    createSlidesFromItems(items);

    // Hide the Collection List Wrapper
    wrapper.style.display = 'none';
  }

  return createSlidesFromItems;
};
