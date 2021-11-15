import { Debug, isNotEmpty } from '@finsweet/ts-utils';
import { ATTRIBUTES } from './constants';
import { Fill } from './Fill';
import { Handle } from './Handle';

import type { getSettings } from './settings';
import type { HandleInstances } from './types';

/**
 * Creates {@link Handle} instances and sets them up.
 * @param settings The settings returned by {@link getSettings}.
 * @returns The new {@link Handle} instances.
 */
export const createHandleInstances = ({
  handleElements,
  inputElements,
  displayValueElements,
  minRange,
  maxRange,
  trackWidth,
  step,
}: NonNullable<ReturnType<typeof getSettings>>): HandleInstances | undefined => {
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
        startValue,
        inputElement,
        displayValueElement,
      });

      return handle;
    })
    .filter(isNotEmpty);

  if (!handles.length) return;

  if (handles.length > 1) handles.sort((handle1, handle2) => handle1.getValue() - handle2.getValue());

  const [handle1, handle2] = handles;

  if (handle2) {
    handle1.addSibling(handle2);
    handle2.addSibling(handle1);
  } else handle1.setConstraints(minRange, maxRange);

  return [handle1, handle2];
};

/**
 * Creates a `Fill` instance and adds it to the Handles.
 * @param settings The settings returned by {@link getSettings}.
 * @param handles The {@link HandleInstances} tuple.
 * @returns
 */
export const createFillInstance = (
  { fillElement, minRange, maxRange, trackWidth }: NonNullable<ReturnType<typeof getSettings>>,
  handles: HandleInstances
) => {
  if (!fillElement) return;

  const fill = new Fill(fillElement, { minRange, maxRange, trackWidth, handles });
  const [handle1, handle2] = handles;

  handle1.addFill(fill);
  handle2?.addFill(fill);
};
