import { initClickTriggers } from './click';
import { ATTRIBUTES } from './constants';
import { initDisplayTriggers } from './display';
import { setReserveScrollBarGap } from './scroll';

// Constants  destructuring
const {
  element: { key: elementKey, values: elementValues },
  gap: { key: gapKey, values: gapValues },
} = ATTRIBUTES;

interface Params {
  reserveScrollbarGap?: boolean;
}

/**
 * Inits the scrolldisable functionalities.
 * Auto init:
 * @param params The current `<script>` element.
 *
 * Programatic init:
 * @param params.reserveScrollbarGap Defines if the scrollbar gap should be preserved when disabling scrolling. `true` by default.
 */
export const init = (params?: HTMLOrSVGScriptElement | Params | null): void => {
  const preserveScrollTargets = document.querySelectorAll(`[${elementKey}="${elementValues.preserve}"]`);

  let reserveScrollbarGap = true;

  if (params instanceof HTMLScriptElement || params instanceof SVGScriptElement) {
    const reserveGapAttribute = params.getAttribute(gapKey);
    if (reserveGapAttribute === gapValues.false) reserveScrollbarGap = false;
  } else if (params) {
    if (typeof params.reserveScrollbarGap === 'boolean') reserveScrollbarGap = params.reserveScrollbarGap;
  }

  setReserveScrollBarGap(reserveScrollbarGap);

  initClickTriggers(preserveScrollTargets);
  initDisplayTriggers(preserveScrollTargets);
};
