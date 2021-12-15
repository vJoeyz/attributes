/**
 * Moves an element to be a direct child of the `<body>`.
 * @param element The element to move.
 * @param timeout An optional timeout.
 * @returns A callback to restore the element's previous position.
 */
export const moveElementToBody = (element: Element, timeout?: number) => {
  const { parentElement } = element;
  if (!parentElement) return;

  const elementIndex = [...parentElement.children].indexOf(element);
  if (elementIndex < 0) return;

  // Create restore callback
  const restoreUntransformedElement = () => {
    parentElement.insertBefore(element, parentElement.children[elementIndex]);
  };

  // Init action
  window.setTimeout(() => {
    document.body.appendChild(element);
  }, timeout);

  return restoreUntransformedElement;
};
