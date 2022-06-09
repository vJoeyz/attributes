import { Debug } from '@finsweet/ts-utils';
import type { GlobalAttributeParams } from '@global/types/global';

import { ATTRIBUTES } from './constants';

/**
 * Checks the global params of the Attribute `<script>`.
 * @param script The `<script>` element.
 * @returns The {@link GlobalAttributeParams}.
 */

export const assessScript = (): GlobalAttributeParams => {
  const { currentScript } = document;
  const { preventLoad, debugMode } = ATTRIBUTES;

  // Check if the Attribute should not be automatically loaded
  const preventsLoad = typeof currentScript?.getAttribute(preventLoad.key) === 'string';

  // Check if Debug Mode is activated
  if (typeof currentScript?.getAttribute(debugMode.key) === 'string') Debug.activateAlerts();

  return { preventsLoad };
};
