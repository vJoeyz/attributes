/**
 * Defines a page source to fetch the component from.
 * @returns the same element than the source element.
 */
import { isAbsoluteURL } from '../utils/isAbsoluteURL';
import { isSameWebflowProject } from '../utils/isSameWebflowProject';

export const getAbsoluteSource = async () => {
  // 1 - get the source URL
  const hrefURL = window.location.href;
  const currentURL = new URL(hrefURL);
  let sourceURL = '';
  const goodSources: string[] = [];
  const sources = document.querySelectorAll('[fs-component-source]');
  for (const source of sources) {
    if (!source) return;
    sourceURL = source.getAttribute('fs-component-source') as string;

    // 2 - check if the source URL is an absolute URL
    if (isAbsoluteURL(source.getAttribute('fs-component-source') as string)) {
      // 3 - check if the source URL belongs to the same Webflow project
      if (await isSameWebflowProject(currentURL.origin, sourceURL))
        // Push the good URLS to the goodSources array
        goodSources.push(source.getAttribute('fs-component-source') as string);
    }
  }

  // 4 - get the ID (that defines the component to copy in the source page)
  let componentId = '';
  const components = document.querySelectorAll('[fs-component-id]');

  for (const component of components) {
    if (!component) return;
    componentId = component.getAttribute('fs-component-id') as string;
  }

  // 5 - fetch the source page and get the element by id
  const fetchAll = async (urls: string[]) => {
    for (const url of urls) {
      const response = await fetch(url);

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
        const targetURL = target.getAttribute('fs-component-source') as string;

        // check if the target's URL is an absolute URL
        if (isAbsoluteURL(targetURL)) {
          // check if the target's source is in the same Webflow project
          if (await isSameWebflowProject(currentURL.origin, targetURL)) {
            targetHTML = target as HTMLElement;
          }
        }
      }

      // check if the source and target are not null
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
  };

  fetchAll(goodSources);
};
