import { ATTRIBUTES } from './constants';
import { init } from '@finsweet/attributes-copyclip/src/init';

import type { AttributeData } from './types';

// Constants destructuring
const {
  element: { key: elementKey, values: elementValues },
} = ATTRIBUTES;

/**
 * Inits the `Copy Example` functionality.
 * @param attributeData The current attribute data.
 */
export const initCopyScriptButton = ({ baseSrc, scriptSrc }: AttributeData): void => {
  const element = document.querySelector<HTMLAnchorElement>(`[${elementKey}="${elementValues.copyScript}"]`);
  if (!element) return;

  init({
    params: {
      selector: `[${elementKey}="${elementValues.copyScript}"]`,
      text: `<script defer src="${baseSrc}/${scriptSrc}"></script>`,
    },
  });
};
