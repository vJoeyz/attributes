/**
 * Defines a page source to fetch the component from.
 * @returns the same element than the source element.
 * @param element The element to fetch the component from.
 */
import { isRelativeURL } from 'src/utils/isRelativeURL';
import { isSameWebflowProject } from 'src/utils/isSameWebflowProject';

export const getRelativeSource = async () => {
  const hrefURL = window.location.href;
  const currentURL = new URL(hrefURL);
  // 1 - get the source URL
  let sourceURL = '';
  const goodSources: string[] = [];

  const sources = document.querySelectorAll('[fs-component-source]');
  for (const source of sources) {
    if (!source) return;
    sourceURL = source.getAttribute('fs-component-source') as string;
    // 2 - verify that the source URL is a relative URL
    if (isRelativeURL(sourceURL)) {
      // 3 - verify that the source URL belongs to the same Webflow project
      if (await isSameWebflowProject(currentURL.origin, sourceURL))
        // Push the good URLS to the goodSources array
        goodSources.push(sourceURL);
    }
  }

  // 4 - get the ID (that defines the component to copy in the source page)
  let componentId = '';
  const components = document.querySelectorAll('[fs-component-id]');

  for (const component of components) {
    if (!component) return;
    if (
      component.getAttribute('fs-component-source') !== sourceURL &&
      isRelativeURL(component.getAttribute('fs-component-source') as string)
    ) {
      componentId = component.getAttribute('fs-component-id') as string;
    }
  }

  // 5 - fetch the source page and get the element by id
  const fetchAll = async (urls: string[]) => {
    for (const url of urls) {
      const parsedURL = new URL(url, currentURL);

      // const response = await fetch(parsedURL.href);
      const response = await fetch(parsedURL.href);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const element = doc.documentElement;
      if (!element) return;
      // in element, get the wanted component by ID
      let sourceComponentHTML: HTMLElement | undefined;
      const sourceComponents = doc.querySelectorAll('[fs-component-id]');

      for (const sourceComponent of sourceComponents) {
        if (!sourceComponent) return;
        sourceComponentHTML = sourceComponent as HTMLElement;
      }
      // extract the HTML from the component's ID
      let targetHTML: HTMLElement | undefined;

      const targets = document.querySelectorAll(`[fs-component-id="${componentId}"]`);

      for (const target of targets) {
        if (!target) return;
        // check if the target's source URL is a relative URL
        if (!isRelativeURL(target.getAttribute('fs-component-source') as string)) return;

        const targetURL = target.getAttribute('fs-component-source') as string;
        const targetParsedURL = new URL(targetURL, currentURL);

        // check if the target's source URL belongs to the same Webflow project
        if (await isSameWebflowProject(currentURL.origin, targetParsedURL.href)) {
          targetHTML = target as HTMLElement;
        }
        // check if the source component and the target exist
        if (
          sourceComponentHTML !== null &&
          sourceComponentHTML !== undefined &&
          targetHTML !== null &&
          targetHTML !== undefined
        ) {
          // 6 - append the source HTML to the target
          targetHTML.innerHTML = sourceComponentHTML.innerHTML;
        } else {
          return;
        }
      }
    }
  };

  fetchAll(goodSources);
};
