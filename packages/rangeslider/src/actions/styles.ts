/**
 * Sets the required CSS styles to a `Handle` element.
 * @param element The `Handle` element.
 */
export const setHandleStyles = (element: HTMLElement) => {
  element.style.position = 'absolute';
  element.style.right = 'unset';
  element.style.top = `50%`;
  element.style.transform = 'translate(-50%, -50%)';
};
