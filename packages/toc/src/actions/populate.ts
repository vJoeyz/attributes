import { cloneNode } from '@finsweet/ts-utils';

import { TOCItem } from '../components/TOCItem';
import { ANCHOR_SELECTOR, getSelector, queryElement } from '../utils/constants';
import type { HeadingData, LinkData } from '../utils/types';

/**
 * Populates all links using the headings data.
 * @param headingsData
 * @param linksData
 * @param tocWrapper
 */
export const populateLinks = (headingsData: HeadingData[], linksData: LinkData[], tocWrapper: HTMLElement) => {
  const tocItems: TOCItem[] = [];
  const levelsMemo: TOCItem[] = [];

  for (const headingData of headingsData) {
    // Get the corresponding link data
    const linkData = linksData.find((data) => data.level === headingData.level);
    if (!linkData) continue;

    // Get the level memo
    for (let i = levelsMemo.length - 1; i >= 0; i--) {
      if (headingData.level > levelsMemo[i].level) break;

      levelsMemo.pop();
    }

    const levelMemo = levelsMemo[levelsMemo.length - 1];

    // Create the component
    const linkWrapper = levelMemo?.component || tocWrapper;
    const component = cloneNode(linkData.component);

    const referenceNode = queryElement('link', { scope: component });
    if (!referenceNode) continue;

    const linkElement = referenceNode.closest('a');
    if (!linkElement) continue;

    const anchor = [...linkWrapper.childNodes].find(
      ({ nodeType, nodeValue }) => nodeType === 8 && nodeValue === ANCHOR_SELECTOR
    );
    if (!anchor) continue;

    const ixTrigger = component.querySelector<HTMLElement>(
      `:scope > ${getSelector('element', 'ixTrigger', { operator: 'prefixed' })}`
    );

    const tocItem = new TOCItem({
      linkWrapper,
      component,
      referenceNode,
      linkElement,
      ixTrigger,
      anchor,
      ...headingData,
    });

    // Store the new level memo
    if (!levelMemo || headingData.level > levelMemo.level) {
      levelsMemo.push(tocItem);
    }

    tocItems.push(tocItem);
  }

  return tocItems;
};
