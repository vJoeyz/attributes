import { initClickTriggers } from './click';
import { ATTRIBUTE, ATTRIBUTES, getSelector } from './constants';
import { initDisplayTriggers } from './display';
import { setReserveScrollBarGap } from './scroll';

// Constants destructuring
const {
  gap: { key: gapKey, values: gapValues },
} = ATTRIBUTES;

/**
 * Inits the scrolldisable functionalities.
 */
export const init = (): void => {
  const preserveScrollTargets = document.querySelectorAll(getSelector('element', 'preserve'));

  let reserveScrollbarGap = true;

  const reserveGapElement = document.querySelector(getSelector('gap'));
  const disableReserveGap = reserveGapElement?.getAttribute(gapKey) === gapValues.false;
  if (disableReserveGap) reserveScrollbarGap = false;

  setReserveScrollBarGap(reserveScrollbarGap);

  initClickTriggers(preserveScrollTargets);
  initDisplayTriggers(preserveScrollTargets);

  window.fsAttributes[ATTRIBUTE].resolve?.(undefined);
};
