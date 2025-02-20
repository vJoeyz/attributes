import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines a form element.
   */
  'form',

  /**
   * Defines an element that, when clicked, should reset the form.
   */
  'reset',

  /**
   * Defines an element that should be clicked after form submission, triggering a Mouse Click interaction.
   */
  'ix-trigger',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines if the form should reset all inputs after submission.
   * If set to true, it resets automatically.
   * If set to a number in miliseconds, it will timeout before resetting.
   */
  reset: {
    key: 'reset',
    values: ['true'],
  },

  /**
   * Defines an element (or a wrapper of multiple elements) that should preserve the value when resetting the form.
   */
  preventreset: {
    key: 'preventreset',
    values: ['true'],
  },

  /**
   * Defines if the form should reload the page after submission.
   * If set to true, it reloads it automatically.
   * If set to a number in miliseconds, it will timeout before reloading.
   */
  reload: {
    key: 'reload',
    values: ['true'],
  },

  /**
   * Defines if the form should redirect after submission.
   * If set to true, it redirects automatically.
   * If set to a number in miliseconds, it will timeout before redirecting.
   */
  redirect: {
    key: 'redirect',
    values: ['true'],
  },

  /**
   * Defines the URL to redirect the user.
   */
  redirecturl: {
    key: 'redirecturl',
  },

  /**
   * Defines the redirect target, either on place or on a new tab.
   */
  redirectnewtab: {
    key: 'redirectnewtab',
    values: ['true'],
  },

  /**
   * Defines if the form should be disabled, preventing all submissions.
   */
  disable: {
    key: 'disable',
    values: ['true'],
  },

  /**
   * Sends the data to the form action as a custom JavaScript Fetch instead of reloading the page.
   */
  enhance: {
    key: 'enhance',
    values: ['true'],
  },
} as const satisfies AttributeSettings;
