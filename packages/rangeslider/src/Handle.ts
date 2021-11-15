import { setFormFieldValue } from '@finsweet/ts-utils';
import { HANDLE_INCREMENT_KEYS, HANDLE_KEYS } from './constants';
import { adjustValueToStep } from './values';

import type { Fill } from './Fill';

export class Handle {
  private readonly index;
  private readonly minRange;
  private readonly maxRange;
  private readonly totalRange;
  private readonly step;

  private readonly inputElement;
  private readonly displayValueElement;

  private fill?: Fill;
  private sibling?: Handle;

  private trackWidth;

  private currentValue!: number;
  private minValue;
  private maxValue;

  constructor(
    public readonly element: HTMLElement,
    {
      index,
      minRange,
      maxRange,
      trackWidth,
      step,
      startValue,
      inputElement,
      displayValueElement,
    }: {
      index: number;
      minRange: number;
      maxRange: number;
      trackWidth: number;
      step: number;
      startValue: number;
      inputElement?: HTMLInputElement;
      displayValueElement?: HTMLElement;
    }
  ) {
    element.setAttribute('role', 'slider');
    element.setAttribute('tabindex', '0');
    element.style.position = 'absolute';
    element.style.right = 'unset';
    element.style.top = `50%`;
    element.style.transform = 'translate(-50%, -50%)';

    this.inputElement = inputElement;
    this.displayValueElement = displayValueElement;

    this.index = index;
    this.minRange = minRange;
    this.maxRange = maxRange;
    this.totalRange = maxRange - minRange;
    this.step = step;

    this.minValue = minRange;
    this.maxValue = maxRange;

    this.trackWidth = trackWidth;

    this.setValue(startValue);
    this.listenEvents();
  }

  /**
   * Listens for internal events.
   */
  private listenEvents() {
    const { element, inputElement } = this;

    element.addEventListener('keydown', (e) => this.handleKeyDown(e));
    inputElement?.addEventListener('change', () => this.handleInputChange());
  }

  /**
   * Handles when the keyboard is used when focusing the Handle.
   * @param e A `keydown` event.
   */
  private handleKeyDown(e: KeyboardEvent) {
    const { step } = this;
    const { key } = e;

    if (!HANDLE_KEYS.includes(key)) return;

    e.preventDefault();

    const currentValue = this.getValue();

    if (HANDLE_INCREMENT_KEYS.includes(key)) this.setValue(currentValue + step);
    else this.setValue(currentValue - step);
  }

  /**
   * Handles when the value of the `<input>` element is updated by third party actions.
   */
  private handleInputChange() {
    const { inputElement, index, minRange, maxRange, step } = this;
    if (!inputElement) return;

    const { value } = inputElement;

    const numericValue = parseFloat(value);

    if (numericValue) {
      this.setValue(adjustValueToStep(numericValue, step));

      return;
    }

    this.setValue(index === 0 ? minRange : maxRange, false);
  }

  /**
   * Updates the Handle's position on the track.
   */
  private updatePosition() {
    const { currentValue, element, trackWidth, minRange, totalRange, fill } = this;

    const left = ((currentValue - minRange) * trackWidth) / totalRange;

    element.style.left = `${left}px`;

    fill?.update();
  }

  /**
   * @returns The current value of the Handle.
   */
  public getValue = (): number => this.currentValue;

  /**
   * Sets a new value to the Handle.
   * The Handle's position is automatically updated based on the new value.
   * @param newValue The new value to set.
   * @param updateInputElement Defines if the `<input>` element should be updated. Defaults to `true`.
   */
  public setValue(newValue: number, updateInputElement = true): void {
    const { currentValue, element, minValue, maxValue, inputElement, displayValueElement } = this;

    if (currentValue === newValue || newValue < minValue || newValue > maxValue) return;

    this.currentValue = newValue;

    this.updatePosition();
    this.updateSiblingConstraints();

    const stringValue = `${newValue}`;
    const localeStringValue = newValue.toLocaleString();

    element.setAttribute('aria-valuenow', stringValue);

    if (displayValueElement) displayValueElement.textContent = localeStringValue;

    if (inputElement && updateInputElement) setFormFieldValue(inputElement, stringValue);
  }

  /**
   * @returns The Handle's constraints.
   */
  public getConstraints = (): [number, number] => [this.minValue, this.maxValue];

  /**
   * Sets new constraints to the Handle.
   * @param minValue The new minimum value.
   * @param maxValue The new maximum value.
   */
  public setConstraints(minValue: number, maxValue: number): void {
    const { element } = this;

    element.setAttribute('aria-valuemin', `${minValue}`);
    element.setAttribute('aria-valuemax', `${maxValue}`);

    this.minValue = minValue;
    this.maxValue = maxValue;
  }

  /**
   * Updates the sibling's constaints, if existing.
   */
  public updateSiblingConstraints() {
    const { index, sibling, step, minRange, maxRange, currentValue } = this;

    if (!sibling) return;

    if (index === 0) sibling.setConstraints(currentValue + step, maxRange);
    else sibling.setConstraints(minRange, currentValue - step);
  }

  /**
   * Updates the stored track width and the Handle's position on the track.
   * @param newTrackWidth The new track width.
   */
  public updateTrackWidth(newTrackWidth: number) {
    this.trackWidth = newTrackWidth;

    this.fill?.updateTrackWidth(newTrackWidth);
    this.updatePosition();
  }

  /**
   * Adds a `Fill` instance to the Handle.
   * @param fill A {@link Fill} instance.
   */
  public addFill(fill: Fill) {
    this.fill = fill;
  }

  /**
   * Adds a sibling Handle.
   * @param sibling A {@link Handle} instance.
   */
  public addSibling(sibling: Handle) {
    this.sibling = sibling;

    this.updateSiblingConstraints();
  }
}
