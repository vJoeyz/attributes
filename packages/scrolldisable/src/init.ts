import { initClickTriggers } from './click';
import { ATTRIBUTES } from './constants';
import { initDisplayTriggers } from './display';
import { setReserveScrollBarGap } from './scroll';

// Constants  destructuring
const {
  preserveScroll: { key: preserveScrollKey },
  gap: { key: gapKey, values: gapValues },
} = ATTRIBUTES;

interface Params {
  reserveScrollbarGap?: boolean;
}

export function init({ params }: { params: Params }): void;
export function init({ currentScript }: { currentScript: HTMLOrSVGScriptElement | null }): void;
export function init({
  currentScript,
  params,
}: {
  currentScript?: HTMLOrSVGScriptElement | null;
  params?: Params;
}): void {
  const preserveScrollTargets = document.querySelectorAll(preserveScrollKey);

  let reserveScrollbarGap = true;

  if (currentScript) {
    const reserveGapAttribute = currentScript.getAttribute(gapKey);
    if (reserveGapAttribute === gapValues.false) reserveScrollbarGap = false;
  } else if (params) {
    if (typeof params.reserveScrollbarGap === 'boolean') reserveScrollbarGap = params.reserveScrollbarGap;
  }

  setReserveScrollBarGap(reserveScrollbarGap);

  initClickTriggers(preserveScrollTargets);
  initDisplayTriggers(preserveScrollTargets);
}
