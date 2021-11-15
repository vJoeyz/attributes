import type { Handle } from './Handle';

export class Fill {
  private readonly minRange;
  private readonly totalRange;

  private readonly handles: readonly [Handle, Handle | undefined];

  private trackWidth: number;

  constructor(
    public readonly element: HTMLElement,
    {
      minRange,
      maxRange,
      handles,
      trackWidth,
    }: { minRange: number; maxRange: number; handles: readonly [Handle, Handle | undefined]; trackWidth: number }
  ) {
    this.minRange = minRange;
    this.totalRange = maxRange - minRange;

    this.handles = handles;

    this.trackWidth = trackWidth;

    this.update();
  }

  /**
   * Updates the stored track width.
   * The `update` method is fired from the Handles.
   * @param newTrackWidth The new track width.
   */
  public updateTrackWidth(newTrackWidth: number) {
    this.trackWidth = newTrackWidth;
  }

  /**
   * Updates the Fill width and position based on the handle's values.
   */
  public update(): void {
    const {
      element,
      trackWidth,
      minRange,
      totalRange,
      handles: [handle1, handle2],
    } = this;

    let left: number;
    let width: number;

    const leftOffset = ((handle1.getValue() - minRange) * trackWidth) / totalRange;

    if (handle2) {
      left = leftOffset;
      width = ((handle2.getValue() - handle1.getValue()) * trackWidth) / totalRange;
    } else {
      left = 0;
      width = leftOffset;
    }

    element.style.left = `${left}px`;
    element.style.width = `${width}px`;
  }
}
