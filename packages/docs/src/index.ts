import ATTRIBUTES_DATA from '../attributes.json';
import { ATTRIBUTES } from './constants';
import { initCopyExampleButtons } from './copy-examples';
import { initCopyScriptButton } from './copy-script';
import { initExampleDropdowns } from './example-dropdowns';
import { initTitles } from './titles';

import type { AttributeExample } from './types';

// Constants destructuring
const {
  attribute: { key: attributeKey },
} = ATTRIBUTES;

/**
 * Init
 */
window.Webflow ||= [];
window.Webflow.push(async () => {
  initTitles();
  initExampleDropdowns();

  const currentAttributeKey = document.body.getAttribute(attributeKey);
  if (!currentAttributeKey) return;

  const attributeData = ATTRIBUTES_DATA.find(({ key }) => key === currentAttributeKey);
  if (!attributeData) return;

  const { baseSrc, examplesSrc } = attributeData;

  const response = await fetch(`${baseSrc}/${examplesSrc}`);

  const examples: AttributeExample[] = await response.json();

  initCopyExampleButtons(examples);
  initCopyScriptButton(attributeData);
});
