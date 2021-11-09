import type { CMSItemProps } from '$cms/cmscore/src/types';
import type { CMSItem } from '$cms/cmscore/src';

/**
 * @param prop A {@link CMSItemProps} object.
 * @param value The value to highlight. If not provided, the highlighting is removed.
 */
export const toggleHighlight = (
  { elements, values }: CMSItemProps[number],
  validValues: string[],
  highlightCSSClass: string
) => {
  for (const value of values) {
    const element = elements.get(value);
    if (!element) continue;

    const valid = validValues.includes(value);

    element.classList[valid ? 'add' : 'remove'](highlightCSSClass);
  }
};

/**
 * Clears all highlightings of a `CMSItem`.
 * @param item The {@link CMSItem} to clear.
 */
export const clearHighlight = ({ props }: CMSItem, highlightCSSClass: string) => {
  for (const propKey in props) {
    for (const [, element] of props[propKey].elements) element.classList.remove(highlightCSSClass);
  }
};
