import { addListener, isElement, setFormFieldValue } from '@finsweet/ts-utils';

import { ARROW_DOWN_KEY, ARROW_UP_KEY, ENTER_KEY, SPACE_KEY, TAB_KEY } from '$global/constants/keyboard';
import { closeDropdown } from '$global/helpers';

import { CONTROL_KEYS, DROPDOWN_IS_OPEN } from '../utils/constants';
import type { Settings } from '../utils/types';
import { populateOptions } from './populate';
import { updateOptionsState } from './state';

/**
 * Returns the {@link OptionData} of an event target.
 *
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 *
 * @returns The {@link OptionData} object, if found.
 */
const getClickedOptionData = (e: Event, { optionsStore }: Settings) => {
  const { target } = e;

  if (!isElement(target)) return;

  const optionElement = target.closest('a');
  if (!optionElement) return;

  const optionData = optionsStore.find(({ element }) => element === optionElement);
  if (!optionData) return;

  return optionData;
};

/**
 * Handles click events on the dropdown list.
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 */
const handleDropdownListClickEvents = (e: MouseEvent | KeyboardEvent, settings: Settings) => {
  if (e.target === settings.selectElement) return;

  e.preventDefault();

  const optionData = getClickedOptionData(e, settings);
  if (!optionData) return;

  if (!optionData.selected) updateOptionsState(settings, optionData);

  setFormFieldValue(settings.inputElement, optionData.text);

  closeDropdown(settings.dropdownToggle);
};

/**
 * Handles tab key events on the dropdown list.
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 */
const handleTabKeyEvents = (e: KeyboardEvent, { dropdownToggle }: Settings) => {
  const { shiftKey } = e;

  if (shiftKey) e.preventDefault();

  closeDropdown(dropdownToggle, shiftKey);
};

/**
 * Handles arrow keys events on the dropdown list.
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 */
const handleDropdownListArrowKeyEvents = ({ key }: KeyboardEvent, { optionsStore }: Settings) => {
  const focusedOptionIndex = optionsStore.findIndex(({ focused }) => focused);
  if (focusedOptionIndex < 0) return;

  const nextOption = optionsStore[key === ARROW_UP_KEY ? focusedOptionIndex - 1 : focusedOptionIndex + 1];
  nextOption?.element.focus();
};

/**
 * Handles keyboard events on the dropdown list.
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 */
const handleDropdownListKeydownEvents = (e: KeyboardEvent, settings: Settings) => {
  const { key } = e;

  if (!CONTROL_KEYS.includes(key)) return;

  if (key === SPACE_KEY) handleDropdownListClickEvents(e, settings);
  else if (key === TAB_KEY) handleTabKeyEvents(e, settings);
  else if (key === ARROW_UP_KEY || key === ARROW_DOWN_KEY) handleDropdownListArrowKeyEvents(e, settings);
};

/**
 * Handles focus events on the dropdown list.
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 */
const handleDropdownListFocusEvents = (e: FocusEvent, focused: boolean, settings: Settings) => {
  const optionData = getClickedOptionData(e, settings);

  if (!optionData) return;

  optionData.focused = focused;
};

/**
 * Handles arrow keys events on the dropdown list.
 * Targets the focused option, or the first option if none is focused.
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 */
const handleDropdownToggleArrowKeyEvents = ({ key }: KeyboardEvent, { optionsStore }: Settings) => {
  if (key !== ARROW_DOWN_KEY) return;

  const firstOption = optionsStore.find(({ hidden }) => !hidden);
  const focusedOption = optionsStore.find(({ focused, selected }) => focused || selected);

  if (focusedOption) {
    focusedOption.element.focus();
    return;
  }

  if (firstOption) {
    firstOption.element.focus();
    return;
  }

  return;
};

/**
 * Adds two way data binding.
 * Handles `change` events on the hidden `selectElement` and updates the dropdown.
 * @param settings The instance {@link Settings}.
 */
const handleSelectChangeEvents = (settings: Settings) => {
  const { selectElement, optionsStore } = settings;

  const selectedOption = optionsStore.find(({ value }) => value === selectElement.value);
  if (!selectedOption) return;

  updateOptionsState(settings, selectedOption);
};

/**
 * Adds two way data binding.
 * Handles `change` events on the `inputElement` and updates the dropdown.
 * @param settings The instance {@link Settings}.
 */
const handleInputChangeEvents = (e: KeyboardEvent, settings: Settings) => {
  const { key } = e;
  if (key === ARROW_DOWN_KEY || key === ARROW_UP_KEY) return;

  const referenceInput = e.target as HTMLInputElement;
  const inputValue = referenceInput.value.toLowerCase() ?? '';

  if (!settings.dropdownToggle.classList.contains(DROPDOWN_IS_OPEN)) {
    closeDropdown(settings.dropdownToggle);
  }

  populateOptions(settings, inputValue, !inputValue, true);
};
/**
 * Shows the dropdown if hidden.
 * @param settings The instance {@link Settings}.
 */
const handleInputClickEvents = (settings: Settings) => {
  if (!settings.dropdownToggle.classList.contains(DROPDOWN_IS_OPEN)) {
    closeDropdown(settings.dropdownToggle);
  }
};

/**
 * Resets `combobox` selections and clears input field value
 * @param settings The instance {@link Settings}.
 */
const handleClearDropdown = (settings: Settings) => {
  const { selectElement, dropdownToggle, inputElement } = settings;

  inputElement.value = '';
  selectElement.value = '';
  populateOptions(settings, '', true, true);

  closeDropdown(dropdownToggle);
};

/**
 * Listens for click events on the custom elements.
 * @param settings The instance {@link Settings}.
 *
 * @returns A callback to remove all event listeners.
 */
export const listenEvents = (settings: Settings) => {
  const { dropdownToggle, dropdownList, selectElement, inputElement, clearDropdown } = settings;

  const cleanups = [
    addListener(dropdownToggle, 'keydown', (e) => handleDropdownToggleArrowKeyEvents(e, settings)),

    addListener(dropdownList, 'click', (e) => handleDropdownListClickEvents(e, settings)),
    addListener(dropdownList, 'keydown', (e) => handleDropdownListKeydownEvents(e, settings)),
    addListener(dropdownList, 'focusin', (e) => handleDropdownListFocusEvents(e, true, settings)),
    addListener(dropdownList, 'focusout', (e) => handleDropdownListFocusEvents(e, false, settings)),

    addListener(selectElement, 'change', () => handleSelectChangeEvents(settings)),

    addListener(inputElement, 'keyup', (e) => handleInputChangeEvents(e, settings)),
    addListener(inputElement, 'click', () => handleInputClickEvents(settings)),

    addListener(clearDropdown, 'click', () => handleClearDropdown(settings)),
  ];

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
};
