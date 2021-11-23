import ATTRIBUTES_DATA from '../attributes.json';
import { ATTRIBUTES } from './constants';
import { initCopyExampleButtons } from './copy-examples';
import { initCopyScriptButton } from './copy-script';
import { initCodeHighlight } from './highlight';
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

  const { baseSrc, examplesSrc, title, loadMode, scriptSrc } = attributeData;

  const copyCode = `<!-- [Attributes by Finsweet] ${title} -->\n<script ${loadMode} src=\"${baseSrc}/${scriptSrc}\"></script>`;

  initCodeHighlight(copyCode);
  initCopyScriptButton(copyCode);

  try {
    const response = await fetch(`${baseSrc}/${examplesSrc}`);

    const examples: AttributeExample[] = await response.json();

    initCopyExampleButtons(examples);
  } catch (error) {
    return;
  }
});
