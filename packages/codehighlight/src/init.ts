import { ATTRIBUTE as RICH_TEXT_ATTRIBUTE } from 'packages/richtext/src/utils/constants';

import { importHighlightJS } from './actions/import';
import { ATTRIBUTE, ATTRIBUTES, getSelector } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<void> => {
  await window.fsAttributes[RICH_TEXT_ATTRIBUTE]?.loading;

  const referenceElements = [
    ...document.querySelectorAll<HTMLElement>(getSelector('element', 'code', { operator: 'prefixed' })),
  ];

  const theme = referenceElements.reduce<string | null>((theme, referenceElement) => {
    theme ||= referenceElement.getAttribute(ATTRIBUTES.theme.key);
    return theme;
  }, null);

  await importHighlightJS(theme);

  const codeElements = referenceElements.map(initHighlight);

  window.fsAttributes[ATTRIBUTE].resolve?.(codeElements);
};

/**
 * Inits the code highlighting.
 * @param referenceElement The reference element that holds the `<code>` tag.
 * @returns The `<code>` element.
 */
const initHighlight = (referenceElement: HTMLElement) => {
  const codeElement = referenceElement.tagName === 'CODE' ? referenceElement : referenceElement.querySelector('code');
  if (!codeElement) return;

  window.hljs.highlightElement(codeElement);

  return codeElement;
};
