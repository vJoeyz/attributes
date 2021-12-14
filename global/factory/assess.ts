import { Debug } from '@finsweet/ts-utils';
import { ATTRIBUTES } from '../constants/attributes';
import { GlobalAttributeParams } from '../types/global';

/**
 * Checks the global params of the Attribute `<script>`.
 * @param script The `<script>` element.
 * @returns The {@link GlobalAttributeParams}.
 */

export const assessScript = (script: HTMLOrSVGScriptElement | null): GlobalAttributeParams => {
  const { preventLoad, debugMode } = ATTRIBUTES;

  // Check if the Attribute should not be automatically loaded
  const preventsLoad = typeof script?.getAttribute(preventLoad.key) === 'string';

  // Check if Debug Mode is activated
  if (typeof script?.getAttribute(debugMode.key) === 'string') Debug.activateAlerts();

  return { preventsLoad };
};
