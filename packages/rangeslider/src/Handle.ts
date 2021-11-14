import Emittery from 'emittery';
import { setFormFieldValue } from '@finsweet/ts-utils';
import { HANDLE_INCREMENT_KEYS, HANDLE_KEYS } from './constants';
import { adjustValueToStep } from './values';

interface HandleEvents {
  update: number;
}

export class Handle extends Emittery<HandleEvents> {
  private readonly index;
  private readonly minRange;
  private readonly maxRange;
  private readonly step;

  private readonly inputElement;
  private readonly displayValueElement;

  private trackWidth;

  private currentValue = 0;
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
      inputElement,
      displayValueElement,
    }: {
      index: number;
      minRange: number;
      maxRange: number;
      trackWidth: number;
      step: number;
      inputElement?: HTMLInputElement;
      displayValueElement?: HTMLElement;
    }
  ) {
    super();

    element.setAttribute('role', 'slider');
    element.setAttribute('tabindex', '0');
    element.style.top = `50%`;
    element.style.transform = 'translate(-50%, -50%)';

    this.inputElement = inputElement;
    this.displayValueElement = displayValueElement;

    this.index = index;
    this.minRange = minRange;
    this.maxRange = maxRange;
    this.step = step;

    this.minValue = minRange;
    this.maxValue = maxRange;

    this.trackWidth = trackWidth;

    this.listenEvents();
  }

  private listenEvents() {
    const { element, inputElement } = this;

    element.addEventListener('keydown', (e) => this.handleKeyDown(e));
    inputElement?.addEventListener('change', () => this.handleInputChange());
  }

  private handleKeyDown(e: KeyboardEvent) {
    const { step } = this;
    const { key } = e;

    if (!HANDLE_KEYS.includes(key)) return;

    e.preventDefault();

    const currentValue = this.getValue();

    if (HANDLE_INCREMENT_KEYS.includes(key)) this.setValue(currentValue + step);
    else this.setValue(currentValue - step);
  }

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

  public getValue = (): number => this.currentValue;

  public setValue(newValue: number, updateInputElement = true): void {
    const {
      currentValue,
      element,
      trackWidth,
      minRange,
      minValue,
      maxRange,
      maxValue,
      inputElement,
      displayValueElement,
    } = this;

    if (currentValue === newValue || newValue < minValue || newValue > maxValue) return;

    const left = ((newValue - minRange) * trackWidth) / (maxRange - minRange);

    this.currentValue = newValue;

    element.style.left = `${left}px`;

    const stringValue = `${newValue}`;
    const localeStringValue = newValue.toLocaleString();

    element.setAttribute('aria-valuenow', stringValue);

    if (displayValueElement) displayValueElement.textContent = localeStringValue;

    if (inputElement && updateInputElement) setFormFieldValue(inputElement, stringValue);

    this.emit('update', newValue);
  }

  public getConstraints = (): [number, number] => [this.minValue, this.maxValue];

  public setConstraints(minValue: number, maxValue: number): void {
    const { element } = this;

    element.setAttribute('aria-valuemin', `${minValue}`);
    element.setAttribute('aria-valuemax', `${maxValue}`);

    this.minValue = minValue;
    this.maxValue = maxValue;
  }
}
