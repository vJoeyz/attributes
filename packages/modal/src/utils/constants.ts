import { type AttributeElements, type AttributeSettings, MODAL_ATTRIBUTE } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines the modal element.
   */
  'modal',

  /**
   * Defines an open trigger.
   */
  'open',

  /**
   * Defines a close trigger.
   */
  'close',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines the modal animation.
   * Allowed values are defined in {@link "packages/animation"}.
   */
  animation: {
    key: 'animation',
    values: ['fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'grow', 'shrink', 'spin'],
  },

  /**
   * Defines the easing function of the animation.
   * Allowed values are defined in {@link "packages/animation"}.
   */
  easing: {
    key: 'easing',
    values: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'],
  },

  /**
   * Defines the duration of the animation.
   */
  duration: { key: 'duration' },

  /**
   * Defines the display property after animating.
   */
  display: {
    key: 'display',
    values: ['block', 'inline', 'flex', 'grid', 'none', 'contents', 'inline-block', 'inline-flex', 'inline-grid'],
    defaultValue: 'flex',
  },
} as const satisfies AttributeSettings;

export const ANCHOR_TEXT = `fs-${MODAL_ATTRIBUTE}-anchor`;
