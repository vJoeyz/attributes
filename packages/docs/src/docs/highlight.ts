import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import { getSelector } from '../utils/constants';

hljs.registerLanguage('xml', xml);

/**
 * Inits rendering and highlighting the Attribute import script.
 * @param copyCode The string to display and highlight.
 */
export const initCodeHighlight = (copyCode: string) => {
  const embedElement = document.querySelector(getSelector('element', 'code'));
  if (!embedElement) return;

  const preElement = document.createElement('pre');
  const codeElement = document.createElement('code');

  preElement.appendChild(codeElement);
  embedElement.appendChild(preElement);

  codeElement.innerHTML = copyCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt');

  hljs.highlightElement(codeElement);

  return codeElement;
};
