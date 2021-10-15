import { HTML_EMBED_CSS_CLASS, restartWebflow, RICH_TEXT_BLOCK_CSS_CLASS } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector, IGNORE_LINE_PREFIX } from './constants';
import { getChildrenlessElements, unescapeHTML } from './helpers';
import { COMPONENT_TEMPLATE_REGEX } from './regex';
import { getComponentHTML } from './components';
import { sanitizeHTML } from './sanitize';

import type { RichTextBlockElement } from '@finsweet/ts-utils';

// Types
interface Params {
  selector?: string;
}

// Constants
const {
  sanitize: { key: sanitizeKey, values: sanitizeValues },
  resetIx: { key: resetIxKey, values: resetIxValues },
  globalSelector: { key: globalSelectorKey },
} = ATTRIBUTES;

/**
 * Inits the attribute.
 *
 * Auto init:
 * @param params The current `<script>` element.
 *
 * Programatic init:
 * @param params.selector A global selector for the required Rich Text Block elements.
 */
export const init = (params?: HTMLOrSVGScriptElement | Params | null): void => {
  let globalSelector: string | null | undefined = null;

  if (params instanceof HTMLScriptElement || params instanceof SVGScriptElement) {
    globalSelector = params.getAttribute(globalSelectorKey);
  } else if (params) {
    globalSelector = params.selector;
  }

  const rtbElements = document.querySelectorAll<RichTextBlockElement>(
    `.${RICH_TEXT_BLOCK_CSS_CLASS}${getSelector('element', 'richText', { operator: 'prefixed' })}${
      globalSelector ? `, .${RICH_TEXT_BLOCK_CSS_CLASS}${globalSelector}` : ''
    }`
  );

  for (const rtbElement of rtbElements) initRtbElement(rtbElement);
};

/**
 * Inits a Rich Text Block element, replacing HTML strings for their parsed version, and component templates for the component nodes.
 * @param element
 */
const initRtbElement = async (element: RichTextBlockElement) => {
  const childNodes = getChildrenlessElements(element);

  const sanitize = element.getAttribute(sanitizeKey) === sanitizeValues.true;
  const resetIx = element.getAttribute(resetIxKey) === resetIxValues.true;

  await Promise.all(
    childNodes.map(async (childNode) => {
      const { innerHTML } = childNode;

      if (
        !innerHTML ||
        innerHTML.trim().startsWith(IGNORE_LINE_PREFIX) ||
        childNode.closest(`.${HTML_EMBED_CSS_CLASS}`)
      )
        return;

      const isComponent = COMPONENT_TEMPLATE_REGEX.test(innerHTML);

      if (isComponent) {
        const componentHTML = await getComponentHTML(innerHTML);
        if (componentHTML) childNode.outerHTML = componentHTML;
      } else {
        const unescapedHTML = unescapeHTML(innerHTML);
        childNode.innerHTML = sanitize ? await sanitizeHTML(unescapedHTML) : unescapedHTML;
      }
    })
  );

  if (resetIx) await restartWebflow();
};
