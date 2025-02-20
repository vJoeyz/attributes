import { type AttributeElements, type AttributeSettings, LIST_ATTRIBUTE } from '@finsweet/attributes-utils';

export const ELEMENTS = [] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines an HLS manifest URL.
   */
  manifest: { key: 'manifest' },
} as const satisfies AttributeSettings;

export const LIST_ELEMENT_SELECTOR = `[fs-${LIST_ATTRIBUTE}-element="list"]`;
