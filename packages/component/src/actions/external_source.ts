/**
 * Fetch and defines an external page source to fetch the component from.
 * @returns the same element than the source element.
 * @param element The element to fetch the component from.
 */

export const getExternalSource = (element: Element) => {
  // Define the URL of the source page
  const url = 'https://www.example.com/source-page';

  // Use the fetch API to retrieve the HTML content of the source page
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      // Select all elements with the "fs-component-source" attribute
      const sourceElements = document.querySelectorAll('[fs-component-source]');

      // Iterate over the source elements
      for (const sourceElement of sourceElements) {
        // Get the value of the "fs-component-id" attribute for this element
        const targetId = sourceElement.getAttribute('fs-component-id');

        // Select the target element using the "fs-component-id" value
        const targetElement = document.querySelector(`[fs-component-id="${targetId}"]`);

        // Set the inner HTML of the target element to the parsed HTML code
        if (targetElement !== null) {
          targetElement.outerHTML = html as string;
        }
      }
    });
};
