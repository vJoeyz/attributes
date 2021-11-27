import debounce from 'just-debounce';
import { adjustValueToStep, getClosestValidHandle } from './utils/values';
import { createFillInstance, createHandleInstances } from './factory';
import { getSelector } from './utils/constants';
import { getSettings } from './actions/settings';
import { getClientX } from './actions/events';

import type { Handle } from './components/Handle';
import type { HandleInstances } from './utils/types';

/**
 * Inits the attribute.
 */
export const init = (): (HandleInstances | undefined)[] => {
  const wrapperElements = [
    ...document.querySelectorAll<HTMLElement>(getSelector('element', 'wrapper', { operator: 'prefixed' })),
  ];

  const handleInstances = wrapperElements.map(initRangeSlider);

  return handleInstances;
};

/**
 * Inits a range slider.
 * @param wrapperElement The wrapper element.
 * @returns The {@link HandleInstances}.
 */
const initRangeSlider = (wrapperElement: HTMLElement) => {
  const settings = getSettings(wrapperElement);
  if (!settings) return;

  const handles = createHandleInstances(settings);
  if (!handles) return;

  createFillInstance(settings, handles);

  const { maxRange, minRange, step, totalRange, trackElement } = settings;

  let { trackWidth, trackLeft, trackRight } = settings;
  let focusedHandle: Handle | undefined;

  /**
   * Calculates the value based on where the user clicked and adjusts it to the step increment,
   * @param clientX The event `clientX` value.
   */
  const calculateNewValue = (clientX: number) => {
    const value = minRange + ((clientX - trackLeft) * totalRange) / trackWidth;

    const adjustedValue = adjustValueToStep(value, step);

    return adjustedValue;
  };

  /**
   * Handles when the user moves the cursor/finger while holding down a {@link Handle}.
   * @param e A `mousemove` or `touchmove` event.
   */
  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!focusedHandle) return;

    if (e instanceof MouseEvent) e.preventDefault();

    const clientX = getClientX(e);
    const [minValue, maxValue] = focusedHandle.getConstraints();

    let value: number;

    if (trackLeft > clientX) value = minValue;
    else if (trackRight < clientX) value = maxValue;
    else value = calculateNewValue(clientX);

    focusedHandle.setValue(value);
  };

  /**
   * Handles when the user releases the currently focused {@link Handle}.
   * @param e A `mouseup` or `touchend` event.
   */
  const handleMouseUp = (e: MouseEvent | TouchEvent) => {
    if (e.cancelable) e.preventDefault();

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
    if (e.cancelable) e.preventDefault();

    const clientX = getClientX(e);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);

    let value: number;

    if (trackLeft > clientX) value = minRange;
    else if (trackRight < clientX) value = maxRange;
    else value = calculateNewValue(clientX);

    const closestHandle = getClosestValidHandle(value, handles);
    if (!closestHandle) return;

    closestHandle.element.focus();
    closestHandle.setValue(value);

    focusedHandle = closestHandle;
  };

  /**
   * Updates the stored `trackWidth` value and the Handles' position.
   */
  const handleWindowResize = debounce(() => {
    trackWidth = trackElement.clientWidth;

    ({ left: trackLeft, right: trackRight } = trackElement.getBoundingClientRect());

    for (const handle of handles) if (handle) handle.updateTrackWidth(trackWidth);
  }, 50);

  /**
   * Init events
   */
  trackElement.addEventListener('mousedown', handleMouseDown);
  trackElement.addEventListener('touchstart', handleMouseDown);
  window.addEventListener('resize', handleWindowResize);

  return handles;
};
