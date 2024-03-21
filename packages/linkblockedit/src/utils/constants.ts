import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines the parent element that will act as the `Link Block`.
   */
  'parent',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines a global selector to query multiple `parent` elements.
   */
  selector: { key: 'selector' },
} as const satisfies AttributeSettings;
