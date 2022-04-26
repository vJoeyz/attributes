import { cloneNode } from '@finsweet/ts-utils';

import { ANCHOR_SELECTOR, queryElement } from '../utils/constants';
import type { HeadingData, LinkData } from '../utils/types';

/**
 * Populates all links using the headings data.
 * @param headingsData
 * @param linksData
 * @param tableWrapper
 */
export const populateLinks = (headingsData: HeadingData[], linksData: LinkData[], tableWrapper: HTMLElement) => {
  const levelsMemo: LinkData[] = [];

  const populate = ({ headingElement, level, id, children }: HeadingData) => {
    // Get the corresponding link data
    const linkData = linksData.find((data) => data.level === level);
    if (!linkData) return;

    // Get the level memo
    let levelMemo: LinkData | undefined;

    for (let i = levelsMemo.length - 1; i >= 0; i--) {
      levelMemo = levelsMemo[i];

      if (level >= levelMemo.level) break;

      levelsMemo.pop();
    }

    const wrapperElement = levelMemo ? levelMemo.component : tableWrapper;
    const component = cloneNode(linkData.component);

    const referenceNode = queryElement('link', { scope: component });
    if (!referenceNode) return;

    const linkElement = referenceNode.closest('a');
    if (!linkElement) return;

    // Populate the link
    if (headingElement) {
      referenceNode.textContent = headingElement.textContent;
      linkElement.href = `#${id}`;
    } else {
      linkElement.remove();
    }

    // Insert the component
    const levelExists = level === levelMemo?.level;

    insertLinkComponent(wrapperElement, levelExists ? linkElement : component);

    // Store the new level memo
    if (!levelMemo || level > levelMemo.level) {
      levelsMemo.push({
        level,
        linkElement,
        component,
      });
    }

    // Populate the children
    for (const data of children) populate(data);
  };

  // Init populating
  for (const data of headingsData) populate(data);
};

/**
 * Inserts a link component into the target wrapper element, using the anchor as the reference.
 * @param wrapperElement
 * @param component
 */
const insertLinkComponent = (wrapperElement: HTMLElement, component: HTMLElement) => {
  const anchor = [...wrapperElement.childNodes].find(
    ({ nodeType, nodeValue }) => nodeType === 8 && nodeValue === ANCHOR_SELECTOR
  );

  if (anchor) wrapperElement.insertBefore(component, anchor);
  else wrapperElement.append(component);
};
