import { ATTRIBUTES } from '../utils/constants';

/**
 * Shows or hides an element if the flag value matches the conditions.
 * @param element The element to show or hide.
 * @param show Defines if the element must be displayed or hidden.
 */
export const showOrHideElement = (element: HTMLElement, show: boolean): void => {
  if (show) {
    element.removeAttribute(ATTRIBUTES.showIf.key);
  } else {
    element.remove();
  }
};
