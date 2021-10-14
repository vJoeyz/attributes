import ATTRIBUTES_DATA from '../attributes.json';
import { ATTRIBUTES } from './constants';
import { initCopyExampleButtons } from './copy-examples';
import { initCopyScriptButton } from './copy-script';
import { initTitles } from './titles';

import type { AttributeExample } from './types';

/**
 * Init
 */
window.Webflow ||= [];
window.Webflow.push(async () => {
  const currentAttributeKey = document.body.getAttribute(ATTRIBUTES.attribute.key);
  if (!currentAttributeKey) return;

  const attributeData = ATTRIBUTES_DATA.find(({ key }) => key === currentAttributeKey);
  if (!attributeData) return;

  initTitles();

  const { baseSrc, examplesSrc } = attributeData;

  try {
    const response = await fetch(`${baseSrc}/${examplesSrc}`);

    const examples: AttributeExample[] = await response.json();

    initCopyExampleButtons(examples);
    initCopyScriptButton(attributeData);
  } catch (error) {
    return;
  }
});
