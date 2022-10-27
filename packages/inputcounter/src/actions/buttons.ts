import { addListener, isNotEmpty, setFormFieldValue } from '@finsweet/ts-utils';

import { ARIA_CONTROLS, ARIA_LABEL_KEY, ARIA_ROLE_KEY, ARIA_ROLE_VALUES } from '$global/constants/a11ty';

/**
 * Handles the increment/buttons accessibility and functionality.
 * @param inputElement
 * @param incrementButton
 * @param decrementButton
 * @returns A clanup callback.
 */
export const handleButtons = (
  inputElement: HTMLInputElement,
  incrementButton?: Element | null,
  decrementButton?: Element | null
) => {
  // Set up aria
  for (const button of [incrementButton, decrementButton].filter(isNotEmpty)) {
    button.setAttribute(ARIA_ROLE_KEY, ARIA_ROLE_VALUES.button);
    button.setAttribute(ARIA_CONTROLS, inputElement.id);

    if (!button.hasAttribute(ARIA_LABEL_KEY)) {
      const action = button === incrementButton ? 'Increment' : 'Decrement';
      button.setAttribute(ARIA_LABEL_KEY, `${action} the input value`);
    }
  }

  // Set up listeners
  const cleanupIncrement = addListener(incrementButton, 'click', (e) => {
    e.preventDefault();
    inputElement.stepUp();
  });
  const cleanupDecrement = addListener(decrementButton, 'click', (e) => {
    e.preventDefault();
    inputElement.stepDown();
  });

  return () => {
    cleanupIncrement();
    cleanupDecrement();
  };
};

/**
 * Handles a reset button's accessibility and functionality.
 * @param inputElement
 * @param resetButton
 * @param initialValue
 * @returns A cleanup callback.
 */
export const handleResetButton = (inputElement: HTMLInputElement, resetButton: Element, initialValue: number) => {
  // Set up aria
  resetButton.setAttribute(ARIA_ROLE_KEY, ARIA_ROLE_VALUES.button);
  resetButton.setAttribute(ARIA_CONTROLS, inputElement.id);

  if (!resetButton.hasAttribute(ARIA_LABEL_KEY)) {
    resetButton.setAttribute(ARIA_LABEL_KEY, `Reset the input value to ${initialValue}`);
  }

  // Set up listeners
  const cleanupReset = addListener(resetButton, 'click', (e) => {
    e.preventDefault();
    setFormFieldValue(inputElement, initialValue.toString());
  });

  return cleanupReset;
};
