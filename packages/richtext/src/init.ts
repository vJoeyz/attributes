import { restartWebflow, RICH_TEXT_BLOCK_CSS_CLASS } from '@finsweet/ts-utils';
import type { RichTextBlockElement } from '@finsweet/ts-utils';

import { getComponentHTML } from './components';
import { ATTRIBUTES, getSelector } from './constants';
import { getValidParagraphs, unescapeHTML } from './helpers';
import { HAS_COMPONENT_TEMPLATE_REGEX, IS_HTML_OPENING_TAG_REGEX } from './regex';
import { sanitizeHTML } from './sanitize';

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
  const paragraphs = getValidParagraphs(element);

  const sanitize = element.getAttribute(sanitizeKey) === sanitizeValues.true;
  const resetIx = element.getAttribute(resetIxKey) === resetIxValues.true;

  await Promise.all(
    paragraphs.map(async (paragraph) => {
      const { innerHTML } = paragraph;

      const isComponent = HAS_COMPONENT_TEMPLATE_REGEX.test(innerHTML);
      const isTag = IS_HTML_OPENING_TAG_REGEX.test(innerHTML.trim());

      if (isComponent) {
        const componentHTML = await getComponentHTML(innerHTML);
        if (componentHTML) paragraph.outerHTML = componentHTML;
      } else {
        const unescapedHTML = unescapeHTML(innerHTML);
        paragraph[isTag ? 'outerHTML' : 'innerHTML'] = sanitize ? await sanitizeHTML(unescapedHTML) : unescapedHTML;
      }
    })
  );

  if (resetIx) await restartWebflow(['ix2']);
};
