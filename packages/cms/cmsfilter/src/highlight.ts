import type { CMSItemProps } from '$cms/cmscore/src/types';
import type { CMSItem } from '$cms/cmscore/src';

/**
 * Adds/removes highlighting to a specific `CMSItem` prop.
 *
 * @param prop A {@link CMSItemProps} object.
 *
 * @param validValues The values to highlight. It consists of an array of tuples as:
 * ```
 * [propValue, filterValue]
 * ```
 * Where the `filterValue` is optional and used to wrap the specific matching query in `<span>` tags.
 * If no `propValue` matches, the highlighting is removed.
 *
 * @param highlightCSSClass The CSS Class to appy.
 */
export const toggleHighlight = (
  { elements, values }: CMSItemProps[number],
  validValues: Array<[string] | [string, string]>,
  highlightCSSClass: string
) => {
  for (const value of values) {
    const elementData = elements.get(value);
    if (!elementData) continue;

    const { element, originalHTML } = elementData;

    const [propValue, filterValue] = validValues.find(([propValue]) => propValue === value) || [];

    if (!propValue) {
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
};

/**
 * Clears all highlightings of a `CMSItem`.
 *
 * @param item The {@link CMSItem} to clear.
 * @param highlightCSSClass The CSS Class to remove.
 */
export const clearHighlight = ({ props }: CMSItem, highlightCSSClass: string) => {
  for (const propKey in props) {
    for (const [, { element, originalHTML }] of props[propKey].elements) {
      element.innerHTML = originalHTML;
      element.classList.remove(highlightCSSClass);
    }
  }
};
