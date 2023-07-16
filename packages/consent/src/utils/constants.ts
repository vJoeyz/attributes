import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * This is an element example definition.
   */
  'banner',
  'preferences',
  'open-preferences',
  'fixed-preferences',
  'allow',
  'deny',
  'close',
  'submit',
  'interaction',
  'marketing',
  'personalization',
  'analytics',
  'display',
  'cookie-consent',
  'opt-in',
  'disable',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Accepts informational opt-out or opt-in as value
   */
  mode: {
    key: 'mode',
    values: {
      informational: 'informational',
      'opt-out': 'opt-out',
      'opt-in': 'opt-in',
    },
  },

  /**
   * Ensures components (Banner, Manager and Preferences) will be fetched from the specified URL and rendered to the current page.
   */
  source: {
    key: 'source',
  },

  /**
   * Used in Development or Testing mode only.
   */
  debug: {
    key: 'source',
  },

  /**
   *
   */
  domain: {
    key: 'domain',
  },

  /**
   *
   */
  type: {
    key: 'type',
    values: {
      'cookie-consent': 'cookie-consent',
    },
  },

  /**
   *
   */
  categories: {
    key: 'categories',
    values: {
      personalization: 'personalization',
      marketing: 'marketing',
      analytics: 'analytics',
    },
  },

  /**
   * Cookie category
   */
  category: {
    key: 'category',
    values: {
      personalization: 'personalization',
      marketing: 'marketing',
      analytics: 'analytics',
    },
  },

  /**
   * Makes the body locks and page scrolling is disabled when the Banner is visible.
   */
  scroll: {
    key: 'scroll',
  },

  /**
   * If this attribute is set and no interaction is used for displaying the component, the default fade animation will set this display property.
   */
  display: {
    key: 'display',
    values: {
      block: 'block',
      inline: 'inline',
      grid: 'grid',
      'inline-block': 'inline-block',
      flex: 'flex',
    },
  },

  /**
   * Default is 180 days.
   */
  expires: {
    key: 'expires',
  },

  /**
   * Optionally send consents to an API endpoint, so you can store consent records in your database.
   */
  endpoint: {
    key: 'endpoint',
  },

  /**
   *
   */
  placeholder: {
    key: 'placeholder',
  },

  /**
   *
   */
  src: {
    key: 'src',
  },
} as const satisfies AttributeSettings;
