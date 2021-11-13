import Emittery from 'emittery';
import { HANDLE_INCREMENT_KEYS, HANDLE_KEYS } from './constants';

interface HandleEvents {
  update: number;
}

export class Handle extends Emittery<HandleEvents> {
  private readonly minRange: number;
  private readonly maxRange: number;
  private readonly step: number;

  private trackWidth: number;

  private currentValue = 0;
  private minValue: number;
  private maxValue: number;

  constructor(
    public readonly element: HTMLElement,
    { minRange, maxRange, trackWidth, step }: { minRange: number; maxRange: number; trackWidth: number; step: number }
  ) {
    super();

    element.setAttribute('role', 'slider');
    element.setAttribute('tabindex', '0');
    element.style.transform = 'translate(-50%, -50%)';

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
    const { element, trackWidth, minRange, minValue, maxRange, maxValue } = this;

    if (newValue < minValue || newValue > maxValue) return;

    const left = ((newValue - minRange) * trackWidth) / (maxRange - minRange);

    element.style.top = `50%`;
    element.style.left = `${left}px`;

    element.setAttribute('aria-valuenow', `${newValue}`);

    this.currentValue = newValue;

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
