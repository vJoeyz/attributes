import { isNotEmpty, restartWebflow } from '@finsweet/ts-utils';

import { fetchPageDocument } from '$global/helpers';

import { ATTRIBUTES } from './utils/constants';
import { convertRelativeUrlsToAbsolute, isSameWebflowProject } from './utils/helpers';
import type { ComponentData, ComponentTargetData } from './utils/types';

/**
 * Inits the component targets.
 * @param componentTargetsData
 * @returns The components data.
 */
export const initComponents = async (componentTargetsData: ComponentTargetData[]): Promise<ComponentData[]> => {
  const componentsData = (await Promise.all(componentTargetsData.map(initComponent))).filter(isNotEmpty);

  const shouldResetIx = componentsData.some(({ resetIx }) => resetIx);
  if (shouldResetIx) {
    await restartWebflow();
  }

  return componentsData;
};

/**
 * Inits the component target.
 * @param componentTargetData
 * @returns The component data.
 */
const initComponent = async (componentTargetData: ComponentTargetData): Promise<ComponentData | undefined> => {
  const { target, componentId, proxiedSource, source, loadCSS, autoRender } = componentTargetData;

  const page = await fetchPageDocument(proxiedSource || source);
  if (!page) return;

  const component = page.querySelector<HTMLElement>(`[${ATTRIBUTES.componentId.key}="${componentId}"]`);
  if (!component) return;

  const isSameSite = await isSameWebflowProject(page);
  if (isSameSite) {
    if (autoRender) target.append(component);

    return {
      ...componentTargetData,
      component,
    };
  }

  // Create a shadow root
  let shadowRoot: ShadowRoot | undefined;

  // Load the CSS
  // To load the external CSS, we attach a Shadow DOM to the target element
  if (loadCSS) {
    shadowRoot = target.attachShadow({ mode: 'open' });

    const styleTags = page.querySelectorAll('style, link[rel="stylesheet"]');

    for (const styleTag of styleTags) {
      shadowRoot.append(styleTag);
    }
  }

  // Convert relative URLs to absolute URLs
  convertRelativeUrlsToAbsolute(component, source);

  // Render the component
  if (autoRender) {
    (shadowRoot || target).append(component);
  }

  return {
    ...componentTargetData,
    shadowRoot,
    component,
  };
};
