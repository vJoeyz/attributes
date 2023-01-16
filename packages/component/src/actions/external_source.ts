/**
 * Fetch and defines an external page source to fetch the component from.
 * @returns the same element than the source element.
 * @param element The element to fetch the component from.
 */
import * as csstree from 'css-tree';
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

      // CSS file fetching
      let ast: csstree.CssNode;

      const links = element.querySelectorAll('link[rel="stylesheet"]');
      for (const link of links) {
        const href = link.getAttribute('href');
        if (href?.endsWith('.css')) {
          const cssResponse = await fetch(`https://api.finsweet.com/cors?url=${href}`);
          const css = await cssResponse.text();

          ast = csstree.parse(css);
        }
      }

      const getAst = (css: string) => {
        return csstree.parse(css);
      };

      const findCssRules = (classes: string[]) => {
        getAst(csstree.generate(ast));
        const rules: csstree.CssNode[] = [];
        csstree.walk(ast, {
          visit: 'Rule',
          enter: (node) => {
            if (node.prelude) {
              const selector = csstree.generate(node.prelude);
              for (const className of classes) {
                if (selector.includes(className)) {
                  rules.push(node.block);
                  break;
                }
              }
            }
          },
        });

        const stringifiedCSS = [];
        for (const rule of rules) {
          stringifiedCSS.push(csstree.generate(rule as csstree.CssNode));
        }

        const joinedCSS = stringifiedCSS.join('');
        const cleanedCSS = joinedCSS.replace(/{|}/g, '');

        return cleanedCSS;
      };

      if (!element) return;

      let sourceComponentHTML: HTMLElement | undefined;

      const sourceComponents = doc.querySelectorAll('[fs-component-id]');

      for (const sourceComponent of sourceComponents) {
        if (!sourceComponent) return;
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

      let css;

      if (
        sourceComponentHTML !== null &&
        sourceComponentHTML !== undefined &&
        targetHTML !== null &&
        targetHTML !== undefined
      ) {
        css = findCssRules(Array.from(sourceComponentHTML.classList));
        targetHTML.innerHTML = sourceComponentHTML.innerHTML;
      } else {
        console.error('No component found');
      }

      if (css) targetHTML?.setAttribute('style', css);
    }
  };
  fetchAll(goodSources);
};
