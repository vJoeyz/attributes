import { ARROW_DOWN_KEY, ARROW_UP_KEY, SPACE_KEY, TAB_KEY } from '$utils/keyboard';
import { closeDropdown } from '$utils/dropdowns';
import { CONTROL_KEYS } from '../utils/constants';
import { updateOptionsState } from './state';

import type { OptionData, Settings } from '../utils/types';

/**
 * Returns the {@link OptionData} of an event target.
 *
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 *
 * @returns The {@link OptionData} object, if found.
 */
const getOptionTargetData = (e: Event, { optionsStore }: Settings) => {
  const { target } = e;

  if (!(target instanceof Element)) return;

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

  const optionData = getOptionTargetData(e, settings);
  if (!optionData || optionData.selected) return;

  updateOptionsState(settings, optionData);

  closeDropdown(settings.dropdownToggle);
};

/**
 * Handles tab key events on the dropdown list.
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 */
const handleTabKeyEvents = (e: KeyboardEvent, { optionsStore }: Settings) => {
  const { shiftKey } = e;

  const focusedOptionIndex = optionsStore.findIndex(({ focused }) => focused);
  if (focusedOptionIndex < 0) return;

  const lastIndex = optionsStore.length - 1;

  let nextOption: OptionData | undefined;

  if (shiftKey && focusedOptionIndex === 0) nextOption = optionsStore[lastIndex];
  else if (!shiftKey && focusedOptionIndex === lastIndex) [nextOption] = optionsStore;

  if (!nextOption) return;

  e.preventDefault();
  nextOption.element.focus();
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
  const optionData = getOptionTargetData(e, settings);
  if (!optionData) return;

  optionData.focused = focused;
};

/**
 * Handles arrow keys events on the dropdown list.
 * @param e The Event object.
 * @param settings The instance {@link Settings}.
 */
const handleDropdownToggleArrowKeyEvents = ({ key }: KeyboardEvent, { optionsStore }: Settings) => {
  if (key !== ARROW_DOWN_KEY) return;

  const firstOption = optionsStore.find(({ hidden }) => !hidden);
  if (!firstOption) return;

  firstOption.element.focus();
};

/**
 * Listens for click events on the custom elements.
 * @param settings The instance {@link Settings}.
 */
export const listenEvents = (settings: Settings) => {
  const { dropdownToggle, dropdownList } = settings;

  dropdownToggle.addEventListener('keydown', (e) => handleDropdownToggleArrowKeyEvents(e, settings));

  dropdownList.addEventListener('click', (e) => handleDropdownListClickEvents(e, settings));
  dropdownList.addEventListener('keydown', (e) => handleDropdownListKeydownEvents(e, settings));
  dropdownList.addEventListener('focusin', (e) => handleDropdownListFocusEvents(e, true, settings));
  dropdownList.addEventListener('focusout', (e) => handleDropdownListFocusEvents(e, false, settings));
};
