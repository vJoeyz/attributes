import { isNumber, parseNumericAttribute } from '@finsweet/attributes-utils';

import { setNumberCountA11Y } from './actions/a11y';
import { animateNumberCount } from './actions/animate';
import { observeIntersection } from './actions/observe';
import { extractNumberFromElement } from './utils/helpers';
import { getAttribute, hasAttributeValue } from './utils/selectors';

/**
 * Inits a number count animation.
 * @param numberElement
 */
export const initNumberCount = (numberElement: Element) => {
  const start = getAttribute(numberElement, 'start');
  const rawEnd = getAttribute(numberElement, 'end');
  const duration = getAttribute(numberElement, 'duration');
  const threshold = getAttribute(numberElement, 'threshold');
  const rawLocale = getAttribute(numberElement, 'locale');
  const autoLocale = hasAttributeValue(numberElement, 'locale', 'auto');

  const end = parseNumericAttribute(rawEnd, extractNumberFromElement(numberElement));
  if (!isNumber(end)) return;

  const locale = autoLocale || rawLocale;

  setNumberCountA11Y(numberElement, start, end);

  return observeIntersection(numberElement, threshold, () => {
    animateNumberCount(numberElement, start, end, duration, locale);
  });
};
