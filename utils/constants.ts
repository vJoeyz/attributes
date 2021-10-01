/**
 * Constants
 */
export const ATTRIBUTES_PREFIX = 'fs-attributes';

export const ATTRIBUTES = {
  /**
   * Defines if an Attributes' `<script>` should prevent automatically loading the library.
   */
  preventLoad: { key: `${ATTRIBUTES_PREFIX}-preventload` },

  /**
   * Defines if an Attributes' `<script>` is set to Debug Mode.
   */
  debugMode: { key: `${ATTRIBUTES_PREFIX}-debug` },
} as const;
