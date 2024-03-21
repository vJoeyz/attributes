import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines a list to be included into the target slider.
   */
  'list',

  /**
   * Defines the target slider where all lists will be included into.
   */
  'slider',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines if Webflow should be restarted after populating the sliders.
   */
  resetix: { key: 'resetix', values: { true: 'true' } },
} as const satisfies AttributeSettings;
