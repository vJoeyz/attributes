/**
 * Observes changes in the inline style of an element and updates the display and opacity of the manager element accordingly.
 * @param {HTMLElement} element - The preference modal element to observe.
 * @param {HTMLElement} manager - The manager element whose display and opacity will be updated.
 * @param {HTMLElement} banner - The banner element to check for its display style.
 * @returns {Function} - A cleanup function to stop observing the element.
 */
export const observeElement = (element?: HTMLElement, manager?: HTMLElement, banner?: HTMLElement) => {
  if (!element) return;

  // Create a new MutationObserver instance
  const observer = new MutationObserver((mutationsList) => {
    // Iterate over the mutations
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const { style } = mutation.target as HTMLElement;

        // Check if display style is set to 'none' or opacity is set to 0
        if (style.display === 'none' && banner?.style?.display === 'none') {
          manager?.style?.setProperty('display', 'flex');
          manager?.style?.setProperty('opacity', '1');
        } else {
          manager?.style?.setProperty('display', 'none');
          manager?.style?.setProperty('opacity', '0');
        }
      }
    }
  });

  // Configure the MutationObserver to observe attribute changes
  const observerConfig = { attributes: true };

  // Start observing the target element
  observer.observe(element, observerConfig);

  return () => {
    observer.disconnect();
  };
};
