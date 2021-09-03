import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { isScrollable } from '@finsweet/ts-utils';

let reserveScrollBarGap = true;
let scrollingDisabled = false;

/**
 * @returns The current scrolling state
 */
export const isScrollingDisabled = (): boolean => scrollingDisabled;

/**
 * Updates the `reserveScrollBarGap` param, which is `true` by default.
 * @param value The new value.
 */
export const setReserveScrollBarGap = (value: boolean): void => {
  reserveScrollBarGap = value;
};

/**
 * Disables the scrolling.
 * @param target The target that will preserve scrolling.
 */
export const disableScrolling = (target: Element): void => {
  disableBodyScroll(target, { reserveScrollBarGap });
  scrollingDisabled = true;
};

/**
 * Enables scrolling.
 */
export const enableScrolling = (): void => {
  clearAllBodyScrollLocks();
  scrollingDisabled = false;
};

/**
 * Finds the first scrollable child of an element.
 * @param element
 * @returns The child if found.
 */
export const findFirstScrollableElement = (element: HTMLElement): HTMLElement | undefined => {
  if (isScrollable(element)) return element;

  const children = element.querySelectorAll('*');
  for (const child of children) {
    if (!(child instanceof HTMLElement)) continue;
    if (isScrollable(child)) return child;
  }
};
