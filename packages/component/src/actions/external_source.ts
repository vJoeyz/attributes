/**
 * Fetch and defines an external page source to fetch the component from.
 * @returns the same element than the source element.
 * @param element The element to fetch the component from.
 */

/**
 * 1 - get the source URL
 * 2 - check that the source URL belongs to a different Webflow project
 * 3 - get the ID (that defines the component to copy in the source page)
 * 4 - fetch the source page and get the element by ID
 * 5 - extract the HTML from the component's ID
 * 6 - get the target element by ID
 * 7 - parse the source CSS and inline it before the target HTML
 * 7 - replace the target element's HTML and CSS with the source element's HTML and CSS
 */
import { isAbsoluteURL } from 'src/utils/isAbsoluteURL';
import { isExternalURL } from 'src/utils/isExternal';
import { isSameWebflowProject } from 'src/utils/isSameWebflowProject';

export const getExternalSource = async () => {
  let sourceURL = '';
  const goodSources: string[] = [];

  const sources = document.querySelectorAll('[fs-component-source]');
  for (const source of sources) {
    if (!source) return;
    sourceURL = source.getAttribute('fs-component-source') as string;
    if (isAbsoluteURL(sourceURL)) {
      if (!(await isSameWebflowProject(window.location.origin, sourceURL))) goodSources.push(sourceURL);
    }
  }

  let componentId = '';
  const components = document.querySelectorAll('[fs-component-id]');

  for (const component of components) {
    if (!component) return;
    componentId = component.getAttribute('fs-component-id') as string;
  }

  const fetchAll = async (urls: string[]) => {
    for (const url of urls) {
      const response = await fetch(`https://api.finsweet.com/cors?url=${url}`);

      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const element = doc.documentElement;
      if (!element) return;

      let sourceComponentHTML: HTMLElement | undefined;
      const sourceComponents = doc.querySelectorAll('[fs-component-id]');

      for (const sourceComponent of sourceComponents) {
        if (!sourceComponent) return;

        // const componentStyles = getComputedStyle(sourceComponent);
        sourceComponentHTML = sourceComponent as HTMLElement;
      }

      let targetHTML: HTMLElement | undefined;

      const targets = document.querySelectorAll(`[fs-component-id="${componentId}"]`);
      for (const target of targets) {
        if (!target) return;
        const targetURL = target.getAttribute('fs-component-source') as string;

        if (await isExternalURL(targetURL)) {
          targetHTML = target as HTMLElement;
        }
      }

      if (
        sourceComponentHTML !== null &&
        sourceComponentHTML !== undefined &&
        targetHTML !== null &&
        targetHTML !== undefined
      ) {
        // TODO: parse the source CSS and inline it before the target HTML
        targetHTML.innerHTML = sourceComponentHTML.innerHTML;
      } else {
        console.error('No component found');
      }
    }
  };
  fetchAll(goodSources);
};
