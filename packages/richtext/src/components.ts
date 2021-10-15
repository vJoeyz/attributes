import { Debug } from '@finsweet/ts-utils';
import { ATTRIBUTES } from './constants';
import { HAS_COMPONENT_TEMPLATE_REGEX, IS_EXTERNAL_COMPONENT_REGEX, TRAILING_SLASH_REGEX } from './regex';

/**
 *
 * @returns The `outterHTML` of a component based on the templating syntax:
 * @param rawHTML The raw HTML containing the templating syntax.
 * @example ```
 * {{component-name}} // A component with `fs-richtext-component="component-name"` will be queried on the same page.
 * {{component-name="/page-path"}} // A component with `fs-richtext-component="component-name"` will be queried on the `/page-path` page.
 * ```
 */
export const getComponentHTML = async (rawHTML: string): Promise<string | undefined> => {
  let component: HTMLElement | null | undefined;

  const [componentDefinition] = rawHTML.match(HAS_COMPONENT_TEMPLATE_REGEX) || [];
  if (!componentDefinition) return;

  const rawComponentKey = componentDefinition.replace('{{', '').replace('}}', '').trim();

  const isExternal = IS_EXTERNAL_COMPONENT_REGEX.test(rawComponentKey);

  if (!isExternal) component = await queryComponent(rawComponentKey);
  else {
    const [componentKey] = rawComponentKey.split('="');
    const [rawSource] = rawComponentKey.match(IS_EXTERNAL_COMPONENT_REGEX) || [];

    if (!componentKey || !rawSource) return;

    const { origin, href: currentHref } = window.location;

    let source = rawSource.replace('="', '').replace('"', '').trim();

    if (source.startsWith('/')) source = origin.replace(TRAILING_SLASH_REGEX, '') + source;

    const { href: sourceHref } = new URL(source);

    const validSource = currentHref !== sourceHref;

    component = await queryComponent(componentKey, validSource ? source : undefined);
  }

  if (component) return component.outerHTML;
};

/**
 * Queries a component by key.
 * @param componentKey The key of the component.
 * @param source A external source where the component is located.
 * @returns The component node, if existing.
 */
const queryComponent = async (componentKey: string, source?: string): Promise<HTMLElement | null | undefined> => {
  let externalDocument: Document | undefined;

  if (source) {
    try {
      const response = await fetch(source);
      const data = await response.text();

      const parser = new DOMParser();
      externalDocument = parser.parseFromString(data, 'text/html');
    } catch (error) {
      Debug.alert(`[${source}] is not a valid source.`, 'error');
      return;
    }
  }

  const component = (externalDocument || document).querySelector<HTMLElement>(
    `[${ATTRIBUTES.component.key}="${componentKey}"]`
  );

  if (!component) Debug.alert(`No components were found with the [${componentKey}] key.`, 'info');

  return component;
};
