import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';
import { boolean, optional, record, string, type } from 'superstruct';

export const ELEMENTS = ['loader'] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines clientId for the LaunchDarkly environment.
   */
  devclientid: { key: 'devclientid' },

  prodclientid: { key: 'prodclientid' },

  eventstotrack: { key: 'eventstotrack' },

  flag: { key: 'flag' },

  showif: { key: 'showif' },

  setproperties: { key: 'setproperties' },

  cloak: { key: 'cloak' },
} as const satisfies AttributeSettings;

/**
 * Properties
 */
export const TEXT_PROPERTY = `text`;
export const SRC_PROPERTY = `src`;
export const SRCSET_PROPERTY = `srcset`;
export const SIZES_PROPERTY = `sizes`;
export const VALUE_PROPERTY = `value`;
export const CLASS_PROPERTY = `class`;
export const HTML_PROPERTY = `html`;
export const HREF_PROPERTY = `href`;

/**
 * Defines the JSON Flag Value schema.
 */
export const jsonFlagValueSchema = type({
  show: optional(boolean()),
  properties: optional(record(string(), string())),
});

/**
 * Defines if the current envionment is in the staging domain or in production.
 */
export const IS_STAGING = window.location.origin.includes('webflow.io');
