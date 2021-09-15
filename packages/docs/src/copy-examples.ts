import { ATTRIBUTES } from './constants';
import { CopyJSONButton } from '@finsweet/ts-utils';
import { selectedExample } from './stores';

import type { AttributeExample } from './types';

// Constants destructuring
const {
  element: { key: elementKey, values: elementValues },
} = ATTRIBUTES;

/**
 * Inits the `Copy Example` functionality.
 * @param attributeData The current attribute data.
 */
export const initCopyExampleButton = (examples: AttributeExample[]): void => {
  const element = document.querySelector<HTMLAnchorElement>(`[${elementKey}="${elementValues.copyButton}"]`);
  if (!element) return;

  const exampleDisplayElement = document.querySelector<HTMLSpanElement>(
    `[${elementKey}="${elementValues.exampleDisplay}"]`
  );

  const instance = new CopyJSONButton({
    element,
    copyData: examples[selectedExample.get() || 0].data,
  });

  selectedExample.subscribe((exampleId) => {
    instance.updateCopyData(examples[exampleId ? exampleId - 1 : 0].data);

    if (!exampleId) {
      instance.updateTextContent('Please select an example');
      return;
    }

    instance.updateTextContent(`Copy Example ${exampleId}`);
    if (exampleDisplayElement) exampleDisplayElement.textContent = `example ${exampleId}`;
  });
};
