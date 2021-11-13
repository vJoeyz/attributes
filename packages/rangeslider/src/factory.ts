import { Debug, isNotEmpty, setFormFieldValue } from '@finsweet/ts-utils';
import { ATTRIBUTES } from './constants';
import { Handle } from './Handle';

import type { HandleInstances } from './types';

/**
 * Creates {@link Handle} instances and sets them up.
 * @param handleElements The handle elements.
 * @param inputElements An array of input elements, if existing.
 * @param minRange
 * @param maxRange
 * @param trackWidth
 * @returns
 */
export const createHandleInstances = (
  handleElements: HTMLElement[],
  inputElements: HTMLInputElement[],
  displayValueElements: HTMLElement[],
  minRange: number,
  maxRange: number,
  trackWidth: number,
  step: number
): HandleInstances | undefined => {
  const handles = handleElements
    .slice(0, 2)
    .map((handleElement, index) => {
      const startValue = parseFloat(
        handleElement.getAttribute(ATTRIBUTES.start.key) || `${index === 0 ? minRange : maxRange}`
      );

      const inputElement = inputElements[index];
      const displayValueElement = displayValueElements[index];

      if (startValue < minRange) {
        Debug.alert("The start value can't be less than the min.", 'error');
        return;
      }

      if (startValue > maxRange) {
        Debug.alert("The start value can't be greater than the max.", 'error');
        return;
      }

      const handle = new Handle(handleElement, {
        index,
        minRange,
        maxRange,
        trackWidth,
        step,
        inputElement,
        displayValueElement,
      });

      handle.setValue(startValue);

      if (inputElement) setFormFieldValue(inputElement, `${startValue}`);

      return handle;
    })
    .filter(isNotEmpty);

  if (!handles.length) return;

  if (handles.length > 1) handles.sort((handle1, handle2) => handle1.getValue() - handle2.getValue());

  const [handle1, handle2] = handles;

  handle1.setConstraints(minRange, handle2 ? handle2.getValue() - 1 : maxRange);
  handle2?.setConstraints(handle1.getValue() + 1, maxRange);

  return [handle1, handle2];
};
