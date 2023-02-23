import { COMPONENT_ATTRIBUTE } from '$global/constants/attributes';
import { type AttributesDefinition, generateSelectors } from '$global/factory';

const ATTRIBUTES_PREFIX = `fs-${COMPONENT_ATTRIBUTE}`;

export const SOURCE_SETTING_KEY = 'source';
export const COMPONENT_ID_SETTING_KEY = 'id';
export const CSS_SETTING_KEY = 'css';
export const RENDER_SETTING_KEY = 'render';
export const PROXY_SETTING_KEY = 'proxy';
export const RESET_IX_SETTING_KEY = 'resetix';

export const ATTRIBUTES = {
  /**
   * Defines a component source.
   */
  source: {
    key: `${ATTRIBUTES_PREFIX}-${SOURCE_SETTING_KEY}`,
  },

  /**
   * Defines a component source.
   */
  componentId: {
    key: `${ATTRIBUTES_PREFIX}-${COMPONENT_ID_SETTING_KEY}`,
  },

  /**
   * Defines if the CSS of the component should be imported when the component is external.
   * If the component is external and this setting is set to true,
   * the component will be loaded with the CSS inside a Shadow DOM.
   * Defaults to `true`.
   */
  css: {
    key: `${ATTRIBUTES_PREFIX}-${CSS_SETTING_KEY}`,
    values: {
      true: 'true',
    },
  },

  /**
   * Defines if the component should be automatically rendered after loading it.
   * If set to false, the component will be loaded but not rendered,
   * and it will be up to the developer to render it,
   * accessing the node via `Webflow.push([`component`, (componentsData) => {}])`.
   * Defaults to `true`.
   */
  render: {
    key: `${ATTRIBUTES_PREFIX}-${RENDER_SETTING_KEY}`,
    values: {
      true: 'true',
    },
  },

  /**
   * Defines a CORS Proxy prefix.
   */
  proxy: {
    key: `${ATTRIBUTES_PREFIX}-${PROXY_SETTING_KEY}`,
  },

  /**
   * Defines if Webflow should be restarted after rendering the loaded components.
   */
  resetIx: { key: `${ATTRIBUTES_PREFIX}-${RESET_IX_SETTING_KEY}`, values: { true: 'true' } },
} as const satisfies AttributesDefinition;

export const [getSelector, queryElement, getAttribute] = generateSelectors(ATTRIBUTES);
