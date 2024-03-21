import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines the trigger that appends the `lightbox` element as a direct child of the `<body>`.
   */
  'trigger-open',

  /**
   * Defines the trigger that returns the `lightbox` to its previous position.
   */
  'trigger-close',

  /**
   * Defines a trigger that toggles the open/close actions.
   */
  'trigger-toggle',

  /**
   * Defines the element that has `position: fixed`.
   * If not defined, the `trigger-open` element is used.
   */
  'lightbox',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines the timeout to wait before triggering the `close` state.
   */
  wait: { key: 'wait' },
} as const satisfies AttributeSettings;
