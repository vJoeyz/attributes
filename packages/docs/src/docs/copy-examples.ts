import { ATTRIBUTES, getSelector } from '../utils/constants';
import { CopyJSONButton } from '@finsweet/ts-utils';

import type { AttributeExamples } from '$utils/types/examples';

// Constants destructuring
const {
  example: { key: exampleKey },
} = ATTRIBUTES;

/**
 * Inits the `Copy Example` functionality.
 * @param attributeData The current attribute data.
 */
export const initCopyExampleButtons = (examples: AttributeExamples): void => {
  const elements = document.querySelectorAll<HTMLAnchorElement>(getSelector('example'));
  if (!elements) return;

  for (const element of elements) {
    const exampleId = element.getAttribute(exampleKey);
    if (!exampleId) continue;

    const exampleData = examples[parseInt(exampleId) - 1 || 0]?.data;
    if (!exampleData) continue;

    new CopyJSONButton({
      element,
      copyData: exampleData,
    });
  }
};
