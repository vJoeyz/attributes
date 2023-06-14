import { type AttributeElements, type AttributeSettings, CMS_LOAD_ATTRIBUTE } from '@finsweet/attributes-utils';

export const ELEMENTS = [] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines an HLS manifest URL.
   */
  manifest: { key: 'manifest' },
} as const satisfies AttributeSettings;

export const CMS_LOAD_LIST_ELEMENT_SELECTOR = `[fs-${CMS_LOAD_ATTRIBUTE}-element="list"]`;
