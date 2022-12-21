/**
 * Defines a page source to fetch the component from.
 * @returns the same element then the source element.
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
      console.log('good sources w/ push: ', goodSources);
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
      const parsedURL = new URL(url, currentURL);
      console.log('parsedURL: ', parsedURL.href);

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
        // * HERE I GOT THE GOOD TARGET
        if (!isRelativeURL(target.getAttribute('fs-component-source') as string)) return;

        const targetURL = target.getAttribute('fs-component-source') as string;
        console.log('targetURL: ', targetURL);
        const targetParsedURL = new URL(targetURL, currentURL);
        console.log('targetParsedURL: ', targetParsedURL.href);

        // check if the target's source URL is a relative URL

        // check if the target's source URL belongs to the same Webflow project
        console.log('currentURL: ', currentURL.origin, 'targetURL: ', targetParsedURL.href);

        if (await isSameWebflowProject(currentURL.origin, targetParsedURL.href)) {
          console.log('final target: ', target);
          targetHTML = target as HTMLElement;
        }
        // check if the source component and the target exist
        if (
          sourceComponentHTML !== null &&
          sourceComponentHTML !== undefined &&
          targetHTML !== null &&
          targetHTML !== undefined
        ) {
          console.log('sourceComponentHTML: ', sourceComponentHTML);
          console.log('targetHTML: ', targetHTML);

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
