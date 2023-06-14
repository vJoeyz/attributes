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
  animation: { key: 'animation' },

  /**
   * Defines the easing function of the animation.
   * Allowed values are defined in {@link "packages/animation"}.
   */
  easing: { key: 'easing' },

  /**
   * Defines the duration of the animation.
   */
  duration: { key: 'duration' },

  /**
   * Defines the display property after animating.
   */
  display: { key: 'display' },
} as const satisfies AttributeSettings;

export const ANCHOR_TEXT = `fs-${MODAL_ATTRIBUTE}-anchor`;

export const DISPLAY_PROPERTIES = [
  'block',
  'inline',
  'inline-block',
  'flex',
  'inline-flex',
  'grid',
  'inline-grid',
  'none',
  'contents',
] as const;

export const DEFAULT_DISPLAY_PROPERTY = 'flex';
