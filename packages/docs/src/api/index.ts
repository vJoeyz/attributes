import { marked } from 'marked';
import { ATTRIBUTE as CODEHIGHLIGHT_ATTRIBUTE } from 'packages/codehighlight/src/utils/constants';
import { attributesData } from 'packages/docs/api/attributes';
import { ATTRIBUTE as TOC_ATTRIBUTE, queryElement as queryTOCElement } from 'packages/toc/src/utils/constants';

import { getAttributeReadme } from './fetch';

declare global {
  interface Window {
    attributeKey?: string;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const { attributeKey } = window;
  if (!attributeKey) return;

  const attributeData = attributesData.find(({ key }) => key === attributeKey);
  if (!attributeData) return;

  const contentsElement = queryTOCElement('contents');
  if (!contentsElement) return;

  const markdown = await getAttributeReadme(attributeData);
  if (!markdown) return;

  contentsElement.innerHTML = marked.parse(markdown);

  window.fsAttributes[CODEHIGHLIGHT_ATTRIBUTE].init?.();
  window.fsAttributes[TOC_ATTRIBUTE]?.init?.();
});
