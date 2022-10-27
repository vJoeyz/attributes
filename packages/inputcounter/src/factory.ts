import { setFormFieldValue } from '@finsweet/ts-utils';

import { getInstanceIndex, parseNumericAttribute } from '$global/helpers';

import { handleButtons, handleResetButton } from './actions/buttons';
import { handleInput } from './actions/input';
import { ATTRIBUTES, DEFAULT_INITIAL_VALUE, getAttribute, queryElement } from './utils/constants';

/**
 * Inits an input counter component.
 * @param inputElement
 * @returns A cleanup callback.
 */
export const initInputCounter = (inputElement: HTMLInputElement) => {
  const instanceIndex = getInstanceIndex(inputElement, ATTRIBUTES.element.key);

  const rawInitialValue = getAttribute(inputElement, 'initial');
  const initialValue = parseNumericAttribute(rawInitialValue, DEFAULT_INITIAL_VALUE);

  const incrementButton = queryElement('increment', { instanceIndex });
  const decrementButton = queryElement('decrement', { instanceIndex });
  const resetButton = queryElement('reset', { instanceIndex });

  if (!incrementButton && !decrementButton) return;

  // Handle input
  const cleanupInput = handleInput(inputElement);

  // Handle buttons
  const cleanupButtons = handleButtons(inputElement, incrementButton, decrementButton);
  const cleanupResetButton = resetButton ? handleResetButton(inputElement, resetButton, initialValue) : undefined;

  // Enforce number type
  inputElement.type = 'number';

  // Set initial value
  setFormFieldValue(inputElement, initialValue.toString());

  // Return cleanup
  return () => {
    cleanupInput?.();
    cleanupButtons();
    cleanupResetButton?.();
  };
};
