import { cloneNode } from '@finsweet/ts-utils';

import { TOCItem } from '../components/TOCItem';
import { getSelector, queryElement } from '../utils/constants';
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

  for (const { headingElement, level, id } of headingsData) {
    // Get the corresponding link data
    const linkData = linksData.find((data) => data.level === level);
    if (!linkData) continue;

    // Get the level memo
    let levelMemo: TOCItem | undefined;

    for (let i = levelsMemo.length - 1; i >= 0; i--) {
      levelMemo = levelsMemo[i];

      if (level >= levelMemo.level) break;

      levelsMemo.pop();
    }

    const wrapperElement = levelMemo ? levelMemo.component : tocWrapper;
    const component = cloneNode(linkData.component);

    const referenceNode = queryElement('link', { scope: component });
    if (!referenceNode) continue;

    const linkElement = referenceNode.closest('a');
    if (!linkElement) continue;

    const ixTrigger = component.querySelector<HTMLElement>(
      `:scope > ${getSelector('element', 'ixTrigger', { operator: 'prefixed' })}`
    );

    const tocItem = new TOCItem({
      wrapperElement,
      component,
      referenceNode,
      linkElement,
      ixTrigger,
      level,
      headingElement,
      id,
    });

    // Insert the component
    const levelExists = level === levelMemo?.level;

    tocItem.renderLink(levelExists);

    // Store the new level memo
    if (!levelMemo || level > levelMemo.level) {
      levelsMemo.push(tocItem);
    }

    tocItems.push(tocItem);
  }

  return tocItems;
};
