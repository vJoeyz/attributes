import { cloneNode } from '@finsweet/ts-utils';

import { ANCHOR_SELECTOR, getSelector, queryElement } from '../utils/constants';
import type { HeadingData, LinkData, TableData } from '../utils/types';

type LevelMemo = Pick<TableData, 'level' | 'component'>;

/**
 * Populates all links using the headings data.
 * @param headingsData
 * @param linksData
 * @param tableWrapper
 */
export const populateLinks = (headingsData: HeadingData[], linksData: LinkData[], tableWrapper: HTMLElement) => {
  const tableData: TableData[] = [];
  const levelsMemo: LevelMemo[] = [];

  for (const { headingElement, level, id } of headingsData) {
    // Get the corresponding link data
    const linkData = linksData.find((data) => data.level === level);
    if (!linkData) continue;

    // Get the level memo
    let levelMemo: LevelMemo | undefined;

    for (let i = levelsMemo.length - 1; i >= 0; i--) {
      levelMemo = levelsMemo[i];

      if (level >= levelMemo.level) break;

      levelsMemo.pop();
    }

    const wrapperElement = levelMemo ? levelMemo.component : tableWrapper;
    const component = cloneNode(linkData.component);

    const referenceNode = queryElement('link', { scope: component });
    if (!referenceNode) continue;

    const linkElement = referenceNode.closest('a');
    if (!linkElement) continue;

    const ixTrigger = component.querySelector<HTMLElement>(
      `:scope > ${getSelector('element', 'ixTrigger', { operator: 'prefixed' })}`
    );

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
      levelsMemo.push({ level, component });
    }

    tableData.push({
      component,
      level,
      linkElement,
      headingElement,
      id,
      ixTrigger,
    });
  }

  return tableData;
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
