import { Debug, isFormField } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';

/**
 * Collects the required settings.
 * @param wrapperElement The wrapper element.
 * @returns The settings, if no errors were found.
 */
export const getSettings = (
  wrapperElement: HTMLElement
):
  | {
      trackElement: HTMLElement;
      fillElement: HTMLElement | null;
      handleElements: HTMLElement[];
      inputElements: HTMLInputElement[];
      displayValueElements: HTMLElement[];
      trackLeft: number;
      trackRight: number;
      trackWidth: number;
      minRange: number;
      maxRange: number;
      totalRange: number;
      step: number;
    }
  | undefined => {
  const trackElement = wrapperElement.querySelector<HTMLElement>(
    getSelector('element', 'track', { operator: 'prefixed' })
  );

  const fillElement = wrapperElement.querySelector<HTMLElement>(
    getSelector('element', 'fill', { operator: 'prefixed' })
  );

  const inputElements = [...wrapperElement.querySelectorAll('input')].filter(isFormField);

  const handleElements = [
    ...wrapperElement.querySelectorAll<HTMLElement>(getSelector('element', 'handle', { operator: 'prefixed' })),
  ];

  const displayValueElements = [
    ...wrapperElement.querySelectorAll<HTMLElement>(getSelector('element', 'displayValue', { operator: 'prefixed' })),
  ];

  if (!handleElements.length || !trackElement) {
    Debug.alert('The rangeslider is missing a Track element or a Handle element.', 'error');
    return;
  }

  const { left: trackLeft, right: trackRight } = trackElement.getBoundingClientRect();
  const trackWidth = trackElement.clientWidth;
  trackElement.style.position = 'relative';

  const minRange = parseFloat(wrapperElement.getAttribute(ATTRIBUTES.min.key) || '0');
  const maxRange = parseFloat(wrapperElement.getAttribute(ATTRIBUTES.max.key) || `${minRange + 1}`);
  const totalRange = maxRange - minRange;

  if (Number.isNaN(totalRange)) {
    Debug.alert('Please make sure min and max are numbers.', 'error');
    return;
  }

  if (Math.sign(totalRange) === -1) {
    Debug.alert("The min can't be greater than the max.", 'error');
    return;
  }

  const step = parseFloat(wrapperElement.getAttribute(ATTRIBUTES.step.key) || `${totalRange / 100}`);

  return {
    trackElement,
    fillElement,
    handleElements,
    inputElements,
    displayValueElements,
    trackLeft,
    trackRight,
    trackWidth,
    minRange,
    maxRange,
    totalRange,
    step,
  };
};
