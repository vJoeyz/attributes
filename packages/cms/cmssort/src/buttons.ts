import { sortListItems } from './sort';
import { ATTRIBUTES } from './constants';

import type { CSSClasses, SortingDirection } from './types';
import type { CMSList } from '$cms/cmscore/src';

// Types
type ButtonsState = Map<HTMLElement, { sortKey: string; direction?: SortingDirection }>;

/**
 * Inits the sorting with a group of Buttons.
 * @param buttons The button elements.
 * @param listInstance The {@link CMSList} instance.
 * @param cssClasses The state CSS classes (`asc` and `desc`).
 */
export const initButtons = (buttons: NodeListOf<HTMLElement>, listInstance: CMSList, cssClasses: CSSClasses) => {
  // Store the original CMS Order
  const { items } = listInstance;

  const originalItemsOrder = [...items];

  const buttonsState: ButtonsState = new Map();

  let activeButton: HTMLElement | undefined;
  let direction: SortingDirection | undefined;
  let sortKey: string;

  /**
   * Sorts the items based on the current selected `sortKey` and `direction`.
   * @param addingItems Defines if new items are being added.
   * In that case, the rendering responsibilities are handled by another controller.
   */
  const sortItems = async (addingItems?: boolean) => {
    await sortListItems(listInstance, { originalItemsOrder, sortKey, direction, addingItems });
  };

  for (const button of buttons) {
    prepareButton(button, buttonsState, cssClasses);

    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const buttonState = buttonsState.get(button);
      if (!buttonState) return;

      sortKey = buttonState.sortKey;
      direction = getNextDirection(buttonState.direction);

      if (activeButton && button !== activeButton) updateButton(activeButton, undefined, buttonsState, cssClasses);

      activeButton = button;

      updateButton(button, direction, buttonsState, cssClasses);

      await sortItems();
    });
  }

  return sortItems;
};

/**
 * - Inits the button state.
 * - Clears state CSS classes.
 * - Adds `a11ty` attributes.
 * @param button The button element.
 * @param buttonsState The {@link ButtonsState} object.
 * @param cssClasses The state CSS classes (`asc` and `desc`).
 * @returns
 */
const prepareButton = (button: HTMLElement, buttonsState: ButtonsState, cssClasses: CSSClasses) => {
  const sortKey = button.getAttribute(ATTRIBUTES.field.key);
  if (!sortKey) return;

  clearClasses(button, cssClasses);

  button.setAttribute('role', 'columnheader');
  button.setAttribute('tabindex', '0');

  setAria(button);

  buttonsState.set(button, { sortKey });
};

/**
 * Clears the state CSS classes of a button.
 * @param button The button element.
 * @param cssClasses The state CSS classes (`asc` and `desc`).
 */
const clearClasses = (button: HTMLElement, cssClasses: CSSClasses) => {
  for (const cssClass of Object.values(cssClasses)) button.classList.remove(cssClass);
};

/**
 * Sets `a11ty` attributes to a button.
 * @param button The button element.
 * @param direction The direction state of the button.
 */
const setAria = (button: HTMLElement, direction?: SortingDirection | undefined) => {
  button.setAttribute('aria-sort', direction ? (direction === 'asc' ? 'ascending' : 'descending') : 'none');
};

/**
 * Updates the state of a button.
 * @param button The button element.
 * @param direction The new direction.
 * @param buttonsState The {@link ButtonsState} object.
 * @param cssClasses The state CSS classes (`asc` and `desc`).
 */
const updateButton = (
  button: HTMLElement,
  direction: SortingDirection | undefined,
  buttonsState: ButtonsState,
  cssClasses: CSSClasses
) => {
  const buttonState = buttonsState.get(button);
  if (!buttonState) return;

  clearClasses(button, cssClasses);

  if (direction) button.classList.add(cssClasses[direction]);

  setAria(button, direction);

  buttonState.direction = direction;
};

/**
 * @returns The new direction of a button.
 * @param currentDirection The current direction of a button.
 */
// prettier-ignore
const getNextDirection = (currentDirection?: SortingDirection): SortingDirection => (!currentDirection || currentDirection) === 'desc' ? 'asc' : 'desc';
