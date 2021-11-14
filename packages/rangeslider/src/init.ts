import { getSelector } from './constants';
import { createHandleInstances } from './factory';
import { Fill } from './Fill';
import { getSettings } from './settings';
import { adjustValueToStep, getClosestValidHandle } from './values';
import { getClientX } from './events';

import type { Handle } from './Handle';

/**
 * Inits the attribute.
 */
export const init = (): void => {
  const wrapperElements = document.querySelectorAll<HTMLElement>(
    getSelector('element', 'wrapper', { operator: 'prefixed' })
  );

  for (const wrapperElement of wrapperElements) initRangeSlider(wrapperElement);
};

/**
 *
 * @param wrapperElement
 * @returns
 */
const initRangeSlider = (wrapperElement: HTMLElement) => {
  const settings = getSettings(wrapperElement);
  if (!settings) return;

  const {
    fillElement,
    handleElements,
    inputElements,
    displayValueElements,
    maxRange,
    minRange,
    step,
    totalRange,
    trackElement,
    trackWidth,
  } = settings;

  const handles = createHandleInstances(
    handleElements,
    inputElements,
    displayValueElements,
    minRange,
    maxRange,
    trackWidth,
    step
  );
  if (!handles) return;

  const [handle1, handle2] = handles;

  const fill = fillElement ? new Fill(fillElement, { minRange, maxRange, trackWidth, handles }) : undefined;

  let focusedHandle: Handle | undefined;

  /**
   * Handles when the user moves the cursor/finger while holding down a {@link Handle}.
   * @param e A `mousemove` or `touchmove` event.
   */
  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!focusedHandle) return;

    e.preventDefault();

    const clientX = getClientX(e);
    const [minValue, maxValue] = focusedHandle.getConstraints();
    const { left, right } = trackElement.getBoundingClientRect();

    let value: number;

    if (left > clientX) value = minValue;
    else if (right < clientX) value = maxValue;
    else value = ((clientX - left) * totalRange) / trackWidth;

    const adjustedValue = adjustValueToStep(value, step);

    focusedHandle.setValue(adjustedValue);
  };

  /**
   * Handles when the user releases the currently focused {@link Handle}.
   * @param e A `mouseup` or `touchend` event.
   */
  const handleMouseUp = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('touchmove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchend', handleMouseUp);

    focusedHandle?.element.blur();

    focusedHandle = undefined;
  };

  /**
   * Handles when the user holds down a {@link Handle}.
   * @param e A `mousedown` or `touchstart` event.
   */
  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();

    const clientX = getClientX(e);

    const { left, right } = trackElement.getBoundingClientRect();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);

    let value: number;

    if (left > clientX) value = minRange;
    else if (right < clientX) value = maxRange;
    else value = ((clientX - left) * totalRange) / trackWidth;

    const adjustedValue = adjustValueToStep(value, step);

    const closestHandle = getClosestValidHandle(adjustedValue, handles);
    if (!closestHandle) return;

    closestHandle.element.focus();
    closestHandle.setValue(adjustedValue);

    focusedHandle = closestHandle;
  };

  /**
   * Handles' events
   */
  handle1.on('update', (newValue) => {
    handle2?.setConstraints(newValue + step, maxRange);
    fill?.update();
  });

  handle2?.on('update', (newValue) => {
    handle1.setConstraints(minRange, newValue - step);
    fill?.update();
  });

  /**
   * Init events
   */
  trackElement.addEventListener('mousedown', handleMouseDown);
  trackElement.addEventListener('touchstart', handleMouseDown);
};
