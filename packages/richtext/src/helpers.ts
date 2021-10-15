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
 *
 * @param element
 * @returns All the child nodes of the element that don't have any more children under them.
 */
export const getChildrenlessElements = ({ children }: Element): Element[] => {
  const childNodes: Element[] = [];

  const getElements = (element: Element) => {
    const { children } = element;

    if (!children.length) childNodes.push(element);
    else for (const child of children) getElements(child);
  };

  for (const child of children) getElements(child);

  return childNodes;
};
