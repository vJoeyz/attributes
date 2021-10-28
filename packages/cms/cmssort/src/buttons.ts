import { sortListItems } from './sort';
import { ATTRIBUTES } from './constants';

import type { CSSClasses, SortingDirection } from './types';
import type { CMSList } from 'packages/cms/cmscore/src';

// Types
type ButtonsState = Map<HTMLElement, { sortKey: string; direction?: SortingDirection }>;

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
   * @param renderItems If set to `true`, the items of the list are re-rendered.
   */
  const sortItems = async (renderItems?: boolean) => {
    await sortListItems(listInstance, { originalItemsOrder, sortKey, direction, renderItems });
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

      await sortItems(true);
    });
  }

  return sortItems;
};

const prepareButton = (button: HTMLElement, buttonsState: ButtonsState, cssClasses: CSSClasses) => {
  const sortKey = button.getAttribute(ATTRIBUTES.field.key);
  if (!sortKey) return;

  clearClasses(button, cssClasses);

  button.setAttribute('role', 'columnheader');
  button.setAttribute('tabindex', '0');

  setAria(button);

  buttonsState.set(button, { sortKey });
};

const clearClasses = (button: HTMLElement, cssClasses: CSSClasses) => {
  for (const cssClass of Object.values(cssClasses)) button.classList.remove(cssClass);
};

const setAria = (button: HTMLElement, direction?: SortingDirection | undefined) => {
  button.setAttribute('aria-sort', direction ? (direction === 'asc' ? 'ascending' : 'descending') : 'none');
};

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

const getNextDirection = (currentDirection?: SortingDirection): SortingDirection | undefined => {
  if (currentDirection === 'asc') return 'desc';

  return 'asc';
};
