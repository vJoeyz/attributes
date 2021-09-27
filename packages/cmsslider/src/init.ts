import { getInstanceIndex } from '$utils/attributes';
import { WEBFLOW_CSS_CLASSES } from '$utils/webflow';
import { getCollectionElements, restartWebflow } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';

// Types
interface Params {
  listsSelector?: string;
  sliderSelector?: string;
}

interface PopulateData {
  listElements: HTMLDivElement[];
  slider: HTMLDivElement;
}

// Constants destructuring
const {
  element: { key: elementKey },
  lists: { key: selectorKey },
  slider: { key: sliderKey },
} = ATTRIBUTES;

const { slider: sliderCSSClass, slide: slideCSSClass, sliderMask: sliderMaskCSSClass } = WEBFLOW_CSS_CLASSES;

/**
 * Inits the attribute.
 *
 * Auto init:
 * @param params The current `<script>` element.
 *
 * Programatic init:
 * @param params.param A global parameter.
 */
export const init = async (params?: HTMLOrSVGScriptElement | Params | null): Promise<void> => {
  let globalListsSelector: string | null | undefined;
  let globalTargetSelector: string | null | undefined;

  if (params instanceof HTMLScriptElement || params instanceof SVGScriptElement) {
    globalListsSelector = params.getAttribute(selectorKey);
    globalTargetSelector = params.getAttribute(sliderKey);
  } else if (params) {
    globalListsSelector = params.listsSelector;
    globalTargetSelector = params.sliderSelector;
  }

  const lists = document.querySelectorAll(
    `${getSelector('element', 'list', { operator: 'prefixed' })}${
      globalListsSelector ? `, ${globalListsSelector}` : ''
    }`
  );

  // Collect the combine data
  let populateData: Array<PopulateData> = [];

  for (const list of lists) {
    const collectionListElement = getCollectionElements(list, 'list');
    if (!collectionListElement) continue;

    const instanceIndex = getInstanceIndex(list, elementKey);

    // Get the slider target
    const slider = document.querySelector<HTMLDivElement>(
      `.${sliderCSSClass}${getSelector('element', 'slider', { instanceIndex })}${
        globalTargetSelector ? `, .${sliderCSSClass}${globalTargetSelector}` : ''
      }`
    );

    if (!slider) continue;

    // Make sure the combine data exists
    populateData[instanceIndex || 0] ||= { listElements: [], slider };

    // Collect the list
    populateData[instanceIndex || 0].listElements.push(collectionListElement);
  }

  // Filter out invalid lists
  populateData = populateData.filter((data) => data && data.listElements.length);

  // Populate the sliders
  for (const data of populateData) {
    populateSliderFromLists(data);

    // Modify the mask width.
    // This little trick is made on purpose to trigger the `maskChanged` callback in `webflow.js`, which automatically rebuilds all the Slides + Dots logic.
    const { slider } = data;
    slider.style.width = `${slider.offsetWidth - 1}px`;
  }

  await restartWebflow();

  // Remove the sliders width mutations
  for (const { slider } of populateData) slider.style.width = '';
};

/**
 * Creates a new `Slide` inside the Slider for each `Collection Item` of the lists.
 * @param populateData
 */
const populateSliderFromLists = ({ listElements, slider }: PopulateData) => {
  const sliderMask = slider.querySelector<HTMLDivElement>(`.${sliderMaskCSSClass}`);
  const existingSlides = slider.querySelectorAll<HTMLDivElement>(`.${slideCSSClass}`);
  if (!sliderMask || !existingSlides.length) return;

  const slideCSS = existingSlides[0].classList.value;

  existingSlides.forEach((slide) => slide.remove());

  for (const listElement of listElements) {
    const collectionItems = getCollectionElements(listElement, 'items');

    for (const collectionItem of collectionItems) {
      const newSlide = document.createElement('div');
      newSlide.setAttribute('class', slideCSS);

      newSlide.appendChild(collectionItem);
      sliderMask.appendChild(newSlide);
    }

    const collectionWrapper = getCollectionElements(listElement, 'wrapper');
    collectionWrapper?.remove();
  }
};
