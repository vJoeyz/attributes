import { animateNumberCount } from './actions/animate';
import { DEFAULT_DURATION, DEFAULT_START_NUMBER, getAttribute } from './utils/constants';
import { extractNumberFromElement } from './utils/helpers';

/**
 * Inits a number count animation.
 * @param numberElement
 */
export const initNumberCount = (numberElement: Element) => {
  const rawStart = getAttribute(numberElement, 'start');
  const rawEnd = getAttribute(numberElement, 'end');
  const rawDuration = getAttribute(numberElement, 'duration');

  const end =
    (rawEnd ? Number(rawEnd) : extractNumberFromElement(numberElement)) || extractNumberFromElement(numberElement);
  if (!end) return;

  const start = (rawStart ? Number(rawStart) : DEFAULT_START_NUMBER) || DEFAULT_START_NUMBER;
  const duration = (rawDuration ? Number(rawDuration) : DEFAULT_DURATION) || DEFAULT_DURATION;

  animateNumberCount(numberElement, start, end, duration);
};
