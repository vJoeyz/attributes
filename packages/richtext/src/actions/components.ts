import { fetchPageDocument } from '@finsweet/attributes-utils';

import {
  HAS_COMPONENT_TEMPLATE_REGEX,
  IS_EXTERNAL_COMPONENT_REGEX,
  MUSTACHE_DELIMITERS_REGEX,
  TRAILING_SLASH_REGEX,
} from '../utils/regex';
import { getSettingSelector } from '../utils/selectors';

/**
 * Memoizes the queried components.
 */
const componentsStore: Array<{ element: HTMLElement; componentKey: string; source?: string }> = [];

const { origin, href: currentHref } = window.location;

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
  const [componentDefinition] = rawHTML.match(HAS_COMPONENT_TEMPLATE_REGEX) || [];
  if (!componentDefinition) return;

  const rawComponentKey = componentDefinition.replace(MUSTACHE_DELIMITERS_REGEX, '').trim();

  const isExternal = IS_EXTERNAL_COMPONENT_REGEX.test(rawComponentKey);

  if (!isExternal) {
    const component = await queryComponent(rawComponentKey);
    return component?.outerHTML;
  }

  const [componentKey] = rawComponentKey.split('="');
  const [rawSource] = rawComponentKey.match(IS_EXTERNAL_COMPONENT_REGEX) || [];

  if (!componentKey || !rawSource) return;

  const source = parseComponentSource(rawSource);
  const component = await queryComponent(componentKey, source);

  return component?.outerHTML;
};

/**
 * Extracts an external source from a component key.
 * @param rawSource The component's source.
 * @example
 * {{component-name="https://example.com/page-path"}} // Will return https://example.com/page-path
 * {{component-name="/page-path"}} // Will also return https://example.com/page-path
 *
 * @returns The source, if valid.
 */
const parseComponentSource = (rawSource: string) => {
  let source = rawSource.replace('="', '').replace('"', '').trim();

  if (source.startsWith('/')) source = origin.replace(TRAILING_SLASH_REGEX, '') + source;

  const { href: sourceHref } = new URL(source);

  const validSource = currentHref !== sourceHref;

  if (validSource) return source;
};

/**
 * Queries a component by key.
 * @param componentKey The key of the component.
 * @param source An external source where the component is located.
 * @returns The component node, if existing.
 */
const queryComponent = async (componentKey: string, source?: string): Promise<HTMLElement | null | undefined> => {
  const storedComponent = componentsStore.find((data) => data.componentKey === componentKey && data.source === source);
  if (storedComponent) return storedComponent.element;

  const externalDocument = source ? await fetchPageDocument(source) : undefined;

  const element = (externalDocument || document).querySelector<HTMLElement>(
    getSettingSelector('component', componentKey)
  );

  if (!element) console.error(`No components were found with the [${componentKey}] key.`);

  if (element) {
    componentsStore.push({
      element,
      componentKey,
      source,
    });

    element.remove();
  }

  return element;
};
