import { cloneNode, SliderNavElement, SLIDER_CSS_CLASSES } from '@finsweet/ts-utils';
import { ATTRIBUTES, DEFAULT_ACTIVE_CSS_CLASS, getSelector, queryElement } from './constants';
import { getInstanceIndex } from '$global/helpers/instances';

import type { SliderElement, SlideElement, SliderDotElement } from '@finsweet/ts-utils';

// Constants
const {
  element: { key: elementKey },
  remove: { key: removeKey, values: removeValues },
  active: { key: activeKey },
} = ATTRIBUTES;

const {
  slider: sliderCSSClass,
  slide: slideCSSClass,
  sliderNav: sliderNavCSSClass,
  sliderDot: sliderDotCSSClass,
  activeSliderDot: activeSliderDotCSSClass,
} = SLIDER_CSS_CLASSES;

const A11TY_ATTRIBUTE_KEYS = ['aria-label', 'aria-pressed', 'role', 'tabindex'] as const;

/**
 * Defines the relationship between an original Slider Dot and its relative Custom Slider Dot.
 * The Map is set as `Map<Original Dot Node, Custom Dot Node>`.
 */
type DotsRelationship = Array<{
  dot: HTMLElement;
  customDot: HTMLElement;
}>;

/**
 * Inits the custom slider dots.
 */
export function init(): void {
  const sliders = document.querySelectorAll<SliderElement>(
    `.${sliderCSSClass}${getSelector('element', 'slider', { operator: 'prefixed' })}`
  );

  for (const slider of sliders) initSliderDots(slider);
}

/**
 * Generates the custom slider dots and inits syncing.
 * @param slider The `SliderElement`.
 */
const initSliderDots = (slider: SliderElement) => {
  // Get slider props
  const instanceIndex = getInstanceIndex(slider, elementKey);

  const sliderNav = slider.querySelector<SliderNavElement>(`.${sliderNavCSSClass}`);
  const customSliderNav = queryElement<HTMLElement>('sliderNav', { instanceIndex });

  if (!sliderNav || !customSliderNav) return;

  const slides = slider.querySelectorAll<SlideElement>(`.${slideCSSClass}`);
  const dots = slider.querySelectorAll<SliderDotElement>(`.${sliderDotCSSClass}`);

  const dotsRelationship: DotsRelationship = [];

  const activeCustomDotCSSClass = slider.getAttribute(activeKey) || DEFAULT_ACTIVE_CSS_CLASS;

  // Populate the dots
  slides.forEach((slide, index) => {
    const dot = dots[index];
    if (!dot) return;

    const customDotElement = queryElement<HTMLElement>('content', { operator: 'prefixed', scope: slide });
    if (!customDotElement) return;

    const mustRemove = customDotElement.getAttribute(removeKey) === removeValues.true;

    const customDot = mustRemove ? customDotElement : cloneNode(customDotElement);

    syncDotsProperties(dot, customDot, activeCustomDotCSSClass);

    customSliderNav.appendChild(customDot);

    dotsRelationship.push({ dot, customDot });
  });

  initCustomSliderNav(sliderNav, customSliderNav, dotsRelationship, activeCustomDotCSSClass);
};

/**
 * Syncronizes the properties from the original `Slider Dot` with the `Custom Slider Dot`.
 * @param dot The original `Slider Dot`.
 * @param customDot The `Custom Slider Dot`.
 * @param activeCSSClass The CSS class used for the `active` state.
 */
const syncDotsProperties = (dot: HTMLElement, customDot: HTMLElement, activeCSSClass: string) => {
  const isActive = dot.classList.contains(activeSliderDotCSSClass);

  customDot.classList[isActive ? 'add' : 'remove'](activeCSSClass);

  for (const attributeKey of A11TY_ATTRIBUTE_KEYS) {
    const value = dot.getAttribute(attributeKey);
    if (value) customDot.setAttribute(attributeKey, value);
  }
};

/**
 * Replicates all actions between the original `Slider Dots` and the `Custom Slider Dots`.
 * @param sliderNav The original `Slider Nav`.
 * @param customSliderNav The `Custom Slider Nav`.
 * @param dotsRelationship The relationship store between both.
 * @param activeCSSClass The CSS class used for the `active` state.
 */
const initCustomSliderNav = (
  sliderNav: SliderNavElement,
  customSliderNav: HTMLElement,
  dotsRelationship: DotsRelationship,
  activeCSSClass: string
) => {
  // Init observer
  const observer = new MutationObserver((mutations) => {
    for (const { target } of mutations) {
      if (!(target instanceof HTMLElement)) continue;

      const relationshipData = dotsRelationship.find(({ dot }) => dot === target);
      if (!relationshipData) continue;

      const { dot, customDot } = relationshipData;

      syncDotsProperties(dot, customDot, activeCSSClass);
    }
  });

  observer.observe(sliderNav, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });

  // Listen for click events
  customSliderNav.addEventListener('click', ({ target }) => {
    if (!(target instanceof Element)) return;

    const customDotTarget = target.closest(getSelector('element', 'content', { operator: 'prefixed' }));
    if (!customDotTarget) return;

    const { dot } = dotsRelationship.find(({ customDot }) => customDot === customDotTarget) || {};

    if (dot) dot.click();
  });
};
