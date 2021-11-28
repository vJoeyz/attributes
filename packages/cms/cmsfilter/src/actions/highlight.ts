import type { CMSItem } from '$cms/cmscore/src';

/**
 * Adds/removes highlighting to the maching prop elements of a specific `CMSItem`.
 *
 * @param item A {@link CMSItem} instance.
 * @param highlightCSSClass The CSS Class to appy.
 */
export const toggleHighlight = ({ props }: CMSItem, highlightCSSClass: string) => {
  for (const propKey in props) {
    const { elements, values, highlightValues } = props[propKey];

    if (!highlightValues) continue;

    for (const value of values) {
      const elementData = elements.get(value);
      if (!elementData) continue;

      const { element, originalHTML } = elementData;

      const filterValue = highlightValues.get(value);

      if (typeof filterValue === 'undefined') {
        element.innerHTML = originalHTML;
        element.classList.remove(highlightCSSClass);
        continue;
      }

      if (!filterValue) {
        element.classList.add(highlightCSSClass);
        continue;
      }

      const regex = new RegExp(filterValue, 'gi');

      element.innerHTML = originalHTML.replace(regex, `<span class="${highlightCSSClass}">$&</span>`);
    }
  }
};

/**
 * Clears all highlightings of a `CMSItem`.
 *
 * @param item The {@link CMSItem} to clear.
 */
export const restartHighlight = ({ props }: CMSItem) => {
  for (const propKey in props) props[propKey].highlightValues = new Map();
};
