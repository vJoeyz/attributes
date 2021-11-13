import { setFormFieldValue } from '@finsweet/ts-utils';
import Emittery from 'emittery';
import { HANDLE_INCREMENT_KEYS, HANDLE_KEYS } from './constants';

interface HandleEvents {
  update: number;
}

export class Handle extends Emittery<HandleEvents> {
  private readonly inputElement;
  private readonly minRange;
  private readonly maxRange;
  private readonly step;

  private trackWidth;

  private currentValue = 0;
  private minValue;
  private maxValue;

  constructor(
    public readonly element: HTMLElement,
    {
      minRange,
      maxRange,
      trackWidth,
      step,
      inputElement,
    }: { minRange: number; maxRange: number; trackWidth: number; step: number; inputElement?: HTMLInputElement }
  ) {
    super();

    element.setAttribute('role', 'slider');
    element.setAttribute('tabindex', '0');
    element.style.top = `50%`;
    element.style.transform = 'translate(-50%, -50%)';

    this.inputElement = inputElement;

    this.minRange = minRange;
    this.maxRange = maxRange;
    this.step = step;

    this.minValue = minRange;
    this.maxValue = maxRange;

    this.trackWidth = trackWidth;

    this.listenEvents();
  }

  private listenEvents() {
    const { element, step } = this;

    element.onkeydown = (e) => {
      const { key } = e;

      if (!HANDLE_KEYS.includes(key)) return;

      e.preventDefault();

      const currentValue = this.getValue();

      if (HANDLE_INCREMENT_KEYS.includes(key)) this.setValue(currentValue + step);
      else this.setValue(currentValue - step);
    };
  }

  public getValue = (): number => this.currentValue;

  public setValue(newValue: number): void {
    const { element, trackWidth, minRange, minValue, maxRange, maxValue, inputElement } = this;

    if (newValue < minValue || newValue > maxValue) return;

    const left = ((newValue - minRange) * trackWidth) / (maxRange - minRange);

    this.currentValue = newValue;

    element.style.left = `${left}px`;

    element.setAttribute('aria-valuenow', `${newValue}`);

    if (inputElement) setFormFieldValue(inputElement, `${newValue}`);

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
