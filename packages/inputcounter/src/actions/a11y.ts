import { ARIA_CONTROLS, ARIA_LABEL_KEY, ARIA_ROLE_KEY, ARIA_ROLE_VALUES } from '$global/constants/a11ty';

/**
 * Sets A11Y attributes to a button.
 * @param inputElement
 * @param button
 * @param label
 */
export const setButtonA11Y = (inputElement: HTMLInputElement, button: Element, label: string) => {
  button.setAttribute(ARIA_ROLE_KEY, ARIA_ROLE_VALUES.button);
  button.setAttribute(ARIA_CONTROLS, inputElement.id);

  if (!button.hasAttribute(ARIA_LABEL_KEY)) {
    button.setAttribute(ARIA_LABEL_KEY, label);
  }
};
