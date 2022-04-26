import { ANCHOR_SELECTOR, DEFAULT_INITIAL_HEADING_LEVEL, getSelector, HEADINGS } from '../utils/constants';
import { extractHeadingLevel } from '../utils/helpers';
import type { HeadingData, LinkData } from '../utils/types';
import { identifyHeadingElement } from './identify';

/**
 * Collects the {@link HeadingData} of all heading elements.
 * @param contentsElement The element that holds all the contents.
 *
 * @returns A {@link HeadingData} array
 */
export const collectHeadingsData = (contentsElement: HTMLElement) => {
  const headingsData: HeadingData[] = [];
  const levelsMemo: HeadingData[] = [];

  const headingElements = contentsElement.querySelectorAll<HTMLHeadingElement>(HEADINGS.join(','));

  for (const headingElement of headingElements) {
    // Get the heading data
    const { tagName } = headingElement;

    const level = extractHeadingLevel(tagName);
    if (!level) continue;

    const id = identifyHeadingElement(headingElement);

    const headingData: HeadingData = {
      level,
      headingElement,
      id,
      children: [],
    };

    // Get the level memo
    let levelMemo: HeadingData | undefined;

    for (let i = levelsMemo.length - 1; i >= 0; i--) {
      levelMemo = levelsMemo[i];

      if (level > levelMemo.level) break;

      levelsMemo.pop();
    }

    if (!levelMemo) {
      headingsData.push(headingData);
      levelsMemo.push(headingData);
      continue;
    }

    // Create a placeholder level memo when a heading level has been skipped
    // Example: the user added an <h5> after an <h3>, he skipped the <h4> level
    const correspondingLevel = levelMemo.level + 1;

    if (level > correspondingLevel) {
      for (let i = 0; i < level - correspondingLevel; i++) {
        const newLevelMemo: HeadingData = {
          level: levelMemo.level + 1,
          children: [],
        };

        levelsMemo.push(newLevelMemo);
        levelMemo.children.push(newLevelMemo);
        levelMemo = newLevelMemo;
      }
    }

    // Store the heading data
    levelMemo.children.push(headingData);
    if (level > levelMemo.level) levelsMemo.push(headingData);
  }

  return headingsData;
};

export const collectLinksData = (linkTemplate: Element) => {
  const linksData: LinkData[] = [];

  const collectLinkData = (referenceNode: Element) => {
    // Query elements
    const linkElement = referenceNode.closest('a');
    if (!linkElement) return;

    const component = linkElement.parentElement;
    if (!component) return;

    // Get the link level
    const previousLevel = linksData[linksData.length - 1]?.level;
    const level = previousLevel ? previousLevel + 1 : DEFAULT_INITIAL_HEADING_LEVEL;

    // const ixTrigger = parentElement.querySelector<HTMLElement>(`:scope > ${ATTRIBUTES.element.values.ixTrigger}`);

    linksData.push({
      linkElement,
      level,
      component,
      // ixTrigger,
    });

    // Get next link component
    const followingTextNodes = [...component.querySelectorAll(`* ${getSelector('element', 'link')}`)];
    const followingTextNode = followingTextNodes.find((node) => node !== referenceNode);

    if (!followingTextNode) return component;

    const followingComponent = collectLinkData(followingTextNode);

    // Place the anchor
    if (followingComponent) {
      const anchor = new Comment(ANCHOR_SELECTOR);
      component.insertBefore(anchor, followingComponent);
      followingComponent.remove();
    }

    return component;
  };

  // Init collection
  const firstLinkComponent = collectLinkData(linkTemplate);

  if (!linksData.length || !firstLinkComponent) return;

  // Get the table wrapper
  const tableWrapper = firstLinkComponent.parentElement;
  if (!tableWrapper) return;

  const anchor = new Comment(ANCHOR_SELECTOR);
  tableWrapper.insertBefore(anchor, firstLinkComponent);
  firstLinkComponent.remove();

  return [linksData, tableWrapper] as const;
};
