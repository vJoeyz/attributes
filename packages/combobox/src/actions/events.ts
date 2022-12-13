import { addListener, isElement, setFormFieldValue } from '@finsweet/ts-utils';

import { ARIA_EXPANDED_KEY } from '$global/constants/a11y';
import { ARROW_DOWN_KEY, ARROW_UP_KEY, BACKSPACE_KEY, ENTER_KEY, SPACE_KEY, TAB_KEY } from '$global/constants/keyboard';

import { toggleDropdown, toggleDropdownCloseIcon } from '../utils';
import { CONTROL_KEYS } from '../utils/constants';
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

  toggleDropdown(settings);
};

/**
 * Handles tab key events on the dropdown list.
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 */
const handleTabKeyEvents = (e: KeyboardEvent, settings: Settings) => {
  const { shiftKey } = e;

  if (shiftKey) e.preventDefault();

  if (e.target) {
    (e.target as HTMLAnchorElement).click();
    settings.inputElement.focus();
  }
  toggleDropdown(settings, shiftKey);
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
const handleInputKeyUpEvents = (e: KeyboardEvent, settings: Settings) => {
  const { key } = e;
  const { dropdownToggle } = settings;
  e.preventDefault();

  const referenceInput = e.target as HTMLInputElement;

  const inputValue = referenceInput.value.toLowerCase().trim() ?? '';

  if (key === ARROW_UP_KEY || key === ENTER_KEY || key === TAB_KEY || key === SPACE_KEY) return;

  if (key === BACKSPACE_KEY && inputValue.length === 0) {
    populateOptions(settings, '', true, true);
    return;
  }

  if (key === BACKSPACE_KEY && inputValue.length > 0) {
    populateOptions(settings, inputValue, !inputValue, true);
    toggleDropdownCloseIcon(settings, inputValue);

    if (dropdownToggle.getAttribute(ARIA_EXPANDED_KEY) !== 'true') {
      toggleDropdown(settings);
    }

    return;
  }

  if (key === ARROW_DOWN_KEY && inputValue.length > 0) {
    populateOptions(settings, inputValue, true, true);
    toggleDropdown(settings);
    return;
  }

  if (dropdownToggle.getAttribute(ARIA_EXPANDED_KEY) !== 'true') {
    toggleDropdown(settings);
  }

  toggleDropdownCloseIcon(settings, inputValue);
  populateOptions(settings, inputValue, !inputValue, true);
};

/**
 * Adds two way data binding.
 * Handles `change` events on the `inputElement` and updates the dropdown.
 * @param settings The instance {@link Settings}.
 */
const handleInputChangeEvents = (e: Event, settings: Settings) => {
  const target = e.target as HTMLInputElement;
  const inputValue = target.value.toLowerCase().trim() ?? '';

  toggleDropdownCloseIcon(settings, inputValue);
};
/**
 * Shows the dropdown if hidden.
 * @param settings The instance {@link Settings}.
 */
const handleInputClickEvents = (settings: Settings) => {
  const { dropdownToggle, inputElement } = settings;

  const toggled = dropdownToggle.getAttribute(ARIA_EXPANDED_KEY) === 'true';
  if (!toggled) {
    toggleDropdown(settings);
  }

  inputElement.setAttribute(ARIA_EXPANDED_KEY, !toggled ? 'true' : 'false');
};

/**
 * Resets `combobox` selections and clears input field value
 * @param settings The instance {@link Settings}.
 */
const handleClearDropdownClickEvents = (e: MouseEvent | KeyboardEvent, settings: Settings) => {
  const { selectElement, inputElement, optionsStore } = settings;

  inputElement.value = '';
  selectElement.value = '';

  populateOptions(settings, '', true, true);

  if (settings.dropdownToggle.getAttribute(ARIA_EXPANDED_KEY) === 'false') return;

  if (settings.dropdownToggle.getAttribute(ARIA_EXPANDED_KEY) === 'true' && optionsStore.length > 0) {
    const [firstOption] = optionsStore;
    firstOption.element.focus();
  }
};

/**
 * Handles key events on the dropdown toggle.
 */
const handleClearDropdownKeyUpEvents = (e: KeyboardEvent, settings: Settings) => {
  const { key } = e as KeyboardEvent;

  if (key !== ENTER_KEY && key !== SPACE_KEY) return;
  handleClearDropdownClickEvents(e, settings);
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

    addListener(inputElement, 'keyup', (e) => handleInputKeyUpEvents(e, settings)),
    addListener(inputElement, 'change', (e) => handleInputChangeEvents(e, settings)),
    addListener(inputElement, 'click', () => handleInputClickEvents(settings)),

    addListener(clearDropdown, 'click', (e) => handleClearDropdownClickEvents(e, settings)),
    addListener(clearDropdown, 'keyup', (e) => handleClearDropdownKeyUpEvents(e, settings)),
  ];

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
};
