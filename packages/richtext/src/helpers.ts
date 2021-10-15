import { HTML_EMBED_CSS_CLASS } from '@finsweet/ts-utils';
import { IGNORE_LINE_PREFIX } from './constants';
import { HAS_COMPONENT_TEMPLATE_REGEX, HAS_HTML_OPENING_TAG_REGEX } from './regex';

/**
 * Replaces escaped HTML symbols with their original value.
 * @param rawHTML The raw HTML to unescape.
 */
export const unescapeHTML = (rawHTML: string): string => {
  return rawHTML
    .replace(/(&nbsp;)/g, ' ')
    .replace(/(&lt;)/g, '<')
    .replace(/(&gt;)/g, '>')
    .replace(/(&amp;)/g, '&')
    .replace(/(&quot;)/g, '"')
    .replace(/(&#96;)/g, '`')
    .replace(/(&#x27;)/g, "'");
};

/**
 * Queries all the valid paragraphs.
 * Removes the {@link IGNORE_LINE_PREFIX} from the matched paragraphs.
 * @returns All the valid paragraphs.
 * @param element The Rich Text Block element.
 */
export const getValidParagraphs = (element: Element): HTMLParagraphElement[] => {
  const paragraphs = [...element.querySelectorAll('p')];

  const filteredParagraphs = paragraphs.filter((paragraph) => {
    const { innerHTML } = paragraph;
    if (!innerHTML) return false;

    const mustIgnore = innerHTML.includes(IGNORE_LINE_PREFIX);
    const hasComponent = HAS_COMPONENT_TEMPLATE_REGEX.test(innerHTML);
    const hasTag = HAS_HTML_OPENING_TAG_REGEX.test(innerHTML);
    const isEmbed = paragraph.closest(`.${HTML_EMBED_CSS_CLASS}`);

    if (mustIgnore) {
      paragraph.innerHTML = innerHTML.replace(IGNORE_LINE_PREFIX, '');
      return false;
    }

    return (hasTag || hasComponent) && !isEmbed;
  });

  return filteredParagraphs;
};
