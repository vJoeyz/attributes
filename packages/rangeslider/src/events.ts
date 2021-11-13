/**
 * @returns The `clientX` property of an event.
 * @param e A {@link MouseEvent} or a {@link TouchEvent}
 */
export const getClientX = (e: MouseEvent | TouchEvent) => {
  if (e instanceof MouseEvent) return e.clientX;

  return e.touches[0].clientX;
};
