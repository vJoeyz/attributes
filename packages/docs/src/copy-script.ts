import { ATTRIBUTES } from './constants';
import { init } from '@finsweet/attributes-copyclip/src/init';
import { ATTRIBUTES as COPYCLIP_ATTRIBUTES } from '@finsweet/attributes-copyclip/src/constants';

import type { AttributeData } from './types';

// Constants destructuring
const {
  element: { key: elementKey, values: elementValues },
} = ATTRIBUTES;

/**
 * Inits the `Copy Example` functionality.
 * @param attributeData The current attribute data.
 */
export const initCopyScriptButton = ({ baseSrc, scriptSrc, loadMode }: AttributeData): void => {
  const element = document.querySelector<HTMLAnchorElement>(`[${elementKey}="${elementValues.copyScript}"]`);
  if (!element) return;

  element.setAttribute(COPYCLIP_ATTRIBUTES.element.key, 'click');
  element.setAttribute(COPYCLIP_ATTRIBUTES.text.key, `<script ${loadMode} src=\"${baseSrc}/${scriptSrc}\"></script>`);
  element.setAttribute(COPYCLIP_ATTRIBUTES.successMessage.key, 'Copied!');

  init();
};
