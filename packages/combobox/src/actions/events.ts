import { addListener, isElement, setFormFieldValue } from '@finsweet/ts-utils';

import { ARIA_ACTIVEDESCENDANT_KEY, ARIA_EXPANDED_KEY, ID_KEY } from '$global/constants/a11y';
import {
  ARROW_DOWN_KEY,
  ARROW_LEFT_KEY,
  ARROW_RIGHT_KEY,
  ARROW_UP_KEY,
  BACKSPACE_KEY,
  CLICK,
  ENTER_KEY,
  ESCAPE_KEY,
  SPACE_KEY,
  TAB_KEY,
} from '$global/constants/keyboard';

import { focusOnInput, toggleDropdown } from '../utils';
import { CONTROL_KEYS, FS_DROPDOWN_TOGGLE_KEY } from '../utils/constants';
import type { OptionData, Settings } from '../utils/types';
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
 * Handles dropdown mouse events: hover
 * Updates input field aria-activedescendant attribute with the option id.
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 */
const handleDropdownListMouseEvents = (e: MouseEvent | KeyboardEvent, settings: Settings) => {
  if (e.target === settings.selectElement) return;

  e.preventDefault();

  const optionData = getClickedOptionData(e, settings);
  if (!optionData) return;

  const optionId = optionData?.element?.getAttribute(ID_KEY);
  settings.inputElement.setAttribute(ARIA_ACTIVEDESCENDANT_KEY, `${optionId || ''}`);

  const isClick = e.type === CLICK;
  const isEnterOrSpace = (e as KeyboardEvent).key === ENTER_KEY || (e as KeyboardEvent).key === SPACE_KEY;

  if (isEnterOrSpace || isClick) handleDropdownListClickEvents(e, optionData, settings);
};
/**
 * Handles click events on the dropdown list.
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 */
const handleDropdownListClickEvents = (e: MouseEvent | KeyboardEvent, optionData: OptionData, settings: Settings) => {
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
    focusOnInput(settings);
  }
  toggleDropdown(settings);
};

/**
 * Handles arrow keys events on the dropdown list.
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 */
const handleDropdownListArrowKeyEvents = ({ key }: KeyboardEvent, settings: Settings) => {
  const { optionsStore } = settings;
  const focusedOptionIndex = optionsStore.findIndex(({ focused }) => focused);
  if (focusedOptionIndex < 0) return;

  const nextOption = optionsStore[key === ARROW_UP_KEY ? focusedOptionIndex - 1 : focusedOptionIndex + 1];

  if (key === ARROW_UP_KEY && !nextOption) {
    toggleDropdown(settings);

    return;
  }
  nextOption?.element.focus();
};

/**
 * Handles keyboard keyup events on the dropdown list.
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 */
const handleDropdownListKeyUpEvents = (e: KeyboardEvent, settings: Settings) => {
  const { key } = e;

  if (key === ARROW_UP_KEY || key === ARROW_DOWN_KEY) {
    const optionId = (e.target as HTMLAnchorElement).getAttribute(ID_KEY);

    settings.inputElement.setAttribute(ARIA_ACTIVEDESCENDANT_KEY, `${optionId || ''}`);
  }
};

/**
 * Handles keyboard keydown events on the dropdown list.
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 */
const handleDropdownListKeydownEvents = (e: KeyboardEvent, settings: Settings) => {
  const { key } = e;

  e.stopPropagation();

  if (key === ESCAPE_KEY) {
    handleClearInput(e, settings);

    const dropdownIsOpen = settings.dropdownToggle.getAttribute(ARIA_EXPANDED_KEY) === 'true';

    if (dropdownIsOpen) {
      toggleDropdown(settings);
    }
    return;
  }

  if (!CONTROL_KEYS.includes(key)) return;

  if (key === SPACE_KEY) handleDropdownListMouseEvents(e, settings);
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
 * Listens to the `input` escape key or focusout events.
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 * @param fromInput Whether the event was triggered from the input element.
 */
const handleClearInput = (e: KeyboardEvent | FocusEvent, settings: Settings, fromInput = false) => {
  const { inputElement, selectElement } = settings;

  const selected = settings.optionsStore.find(({ selected }) => selected);
  if (selected) return;

  if (fromInput) {
    const relatedTarget = (e as FocusEvent).relatedTarget as HTMLElement;
    if (relatedTarget) return;

    inputElement.value = '';
    selectElement.value = '';
    return;
  }

  if (!selected) {
    inputElement.value = '';
    selectElement.value = '';
  }

  const dropdownIsOpen = settings.dropdownToggle.getAttribute(ARIA_EXPANDED_KEY) === 'true';

  if (dropdownIsOpen) {
    toggleDropdown(settings);
  }
};

/**
 * Adds two way data binding.
 * Handles `change` events on the `inputElement` and updates the dropdown.
 * @param settings The instance {@link Settings}.
 */
const handleInputKeyUpEvents = (e: KeyboardEvent, settings: Settings) => {
  const { key } = e;
  const { dropdownToggle, optionsStore, inputElement } = settings;
  e.preventDefault();
  e.stopPropagation();

  inputElement.setAttribute(FS_DROPDOWN_TOGGLE_KEY, CLICK);

  const selectedOption = optionsStore.find(({ selected }) => selected);

  const referenceInput = e.target as HTMLInputElement;

  const inputValue = referenceInput.value.toLowerCase().trim() ?? '';

  const dropdownIsOpen = dropdownToggle.getAttribute(ARIA_EXPANDED_KEY) === 'true';

  if (key === ARROW_DOWN_KEY) {
    inputElement.setAttribute(FS_DROPDOWN_TOGGLE_KEY, ARROW_DOWN_KEY);
  }

  if (key === ESCAPE_KEY) {
    handleClearInput(e, settings);

    if (dropdownIsOpen) {
      toggleDropdown(settings);
    }
    return;
  }

  if (key === ENTER_KEY || key === TAB_KEY || key === SPACE_KEY || key === ARROW_RIGHT_KEY || key === ARROW_LEFT_KEY)
    return;

  if (key === ARROW_DOWN_KEY && !dropdownIsOpen) {
    toggleDropdown(settings);
    populateOptions(settings, '', true, true);

    if (!selectedOption && optionsStore.length > 0) {
      const [firstOption] = optionsStore.filter(({ hidden }) => !hidden);

      firstOption.element.focus();

      return;
    }

    if (selectedOption) {
      selectedOption.element.focus();
      return;
    }
    return;
  }
  if (key === ARROW_UP_KEY && dropdownIsOpen) {
    toggleDropdown(settings);
    return;
  }

  if (key === BACKSPACE_KEY && inputValue.length === 0) {
    populateOptions(settings, '', true, true);
    return;
  }

  if (key === BACKSPACE_KEY && inputValue.length > 0) {
    populateOptions(settings, inputValue, !inputValue, true);
    if (!dropdownIsOpen) toggleDropdown(settings);
    return;
  }

  if (key === ARROW_DOWN_KEY && inputValue.length > 0) {
    populateOptions(settings, inputValue, true, true);
    toggleDropdown(settings);
    return;
  }

  if (!dropdownIsOpen && (inputValue || key === ARROW_DOWN_KEY) && key !== ARROW_UP_KEY) {
    toggleDropdown(settings);
  }

  populateOptions(settings, inputValue, !inputValue, true);
};

/**
 * Listens to `updateComboboxInputField` custom event and updates input value and select value
 * @param settings The instance {@link Settings}.
 */
const updateInputField = (e: Event, settings: Settings) => {
  const { optionsStore, inputElement, dropdownToggle } = settings;
  const input = e.target as HTMLInputElement;

  const selectedOption = optionsStore.find(({ selected }) => selected);
  const selectedText = selectedOption?.text ?? '';
  const selectedValue = selectedOption?.value ?? '';
  const inputValue = input.value;

  if (selectedOption && selectedValue !== inputValue) {
    inputElement.value = selectedText;
    return;
  }
};
/**
 * Shows the dropdown if hidden.
 * @param settings The instance {@link Settings}.
 */
const handleInputClickEvents = (e: MouseEvent, settings: Settings) => {
  e.stopPropagation();
  e.preventDefault();

  const { dropdownToggle, inputElement } = settings;

  inputElement.setAttribute(FS_DROPDOWN_TOGGLE_KEY, CLICK);

  const toggled = dropdownToggle.getAttribute(ARIA_EXPANDED_KEY) === 'true';
  inputElement.setAttribute(ARIA_EXPANDED_KEY, `${!toggled}`);

  if (toggled) {
    return;
  }

  populateOptions(settings, '', true, true);
  toggleDropdown(settings);
};

/**
 * Resets `combobox` selections and clears input field value
 * @param settings The instance {@link Settings}.
 */
const handleClearDropdownClickEvents = (e: MouseEvent | KeyboardEvent, settings: Settings) => {
  const { selectElement, inputElement } = settings;
  e.stopPropagation();

  inputElement.value = '';
  selectElement.value = '';

  populateOptions(settings, '', true, true);

  focusOnInput(settings);
};

/**
 * Handles key events on the dropdown toggle.
 */
const handleClearDropdownKeyUpEvents = (e: KeyboardEvent | MouseEvent, settings: Settings) => {
  const { key } = e as KeyboardEvent;
  e.stopPropagation();
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

  dropdownToggle.onmouseup = (e) => {
    // I believe webflow natively adds this event listener to the dropdown, we need to clear it out
    // so we can handle the click event ourselves.
    e.stopPropagation();
    e.preventDefault();
    return;
  };

  const cleanups = [
    addListener(dropdownToggle, 'keydown', (e) => handleDropdownToggleArrowKeyEvents(e, settings)),

    addListener(dropdownList, 'click', (e) => handleDropdownListMouseEvents(e, settings)),
    addListener(dropdownList, 'keydown', (e) => handleDropdownListKeydownEvents(e, settings)),
    addListener(dropdownList, 'keyup', (e) => handleDropdownListKeyUpEvents(e, settings)),
    addListener(dropdownList, 'focusin', (e) => handleDropdownListFocusEvents(e, true, settings)),
    addListener(dropdownList, 'focusout', (e) => handleDropdownListFocusEvents(e, false, settings)),
    addListener(dropdownList, 'mouseover', (e) => handleDropdownListMouseEvents(e, settings)),
    addListener(dropdownList, 'mouseup', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return;
    }),

    addListener(selectElement, 'change', () => handleSelectChangeEvents(settings)),

    addListener(inputElement, 'keyup', (e) => {
      handleInputKeyUpEvents(e, settings);
    }),
    addListener(inputElement, 'click', (e) => handleInputClickEvents(e, settings)),
    addListener(inputElement, 'mouseup', (e) => handleInputClickEvents(e, settings)),
    addListener(inputElement, 'blur', (e) => handleClearInput(e, settings, true)),
    addListener(inputElement, 'updateComboboxInputField', (e) => updateInputField(e, settings)),

    addListener(clearDropdown, 'click', (e) => handleClearDropdownClickEvents(e, settings)),
    addListener(clearDropdown, 'keyup', (e) => handleClearDropdownKeyUpEvents(e, settings)),
    addListener(clearDropdown, 'mouseup', (e) => handleClearDropdownKeyUpEvents(e, settings)),
    addListener(clearDropdown, 'keydown', (e) => handleClearDropdownKeyUpEvents(e, settings)),
  ];

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
};
