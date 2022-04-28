import {
  ANCHOR_SELECTOR,
  CUSTOM_HEADING_REGEXP,
  DEFAULT_INITIAL_HEADING_LEVEL,
  getSelector,
  ALLOWED_HEADING_TAGS,
  OMIT_HEADING_REGEXP,
} from '../utils/constants';
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

  const headingElements = contentsElement.querySelectorAll<HTMLHeadingElement>(ALLOWED_HEADING_TAGS.join(','));

  for (const headingElement of headingElements) {
    // Get the heading data
    const { tagName, textContent } = headingElement;
    if (!textContent) continue;

    const omit = textContent.match(OMIT_HEADING_REGEXP);
    if (omit) {
      headingElement.textContent = textContent.replace(OMIT_HEADING_REGEXP, '').trim();
      continue;
    }

    const [customTag] = textContent.match(CUSTOM_HEADING_REGEXP) || [];
    if (customTag) headingElement.textContent = textContent.replace(CUSTOM_HEADING_REGEXP, '').trim();

    const level = extractHeadingLevel(customTag || tagName);
    if (!level) continue;

    const id = identifyHeadingElement(headingElement);
    if (!id) continue;

    const headingData: HeadingData = {
      level,
      headingElement,
      id,
    };

    // Get the level memo
    const previousHeading = headingsData[headingsData.length - 1];

    if (!previousHeading) {
      headingsData.push(headingData);
      continue;
    }

    // Create a placeholder level memo when a heading level has been skipped
    // Example: the user added an <h5> after an <h3>, he skipped the <h4> level
    const correspondingLevel = previousHeading.level + 1;

    if (level > correspondingLevel) {
      for (let i = 1; i <= level - correspondingLevel; i++) {
        headingsData.push({ level: previousHeading.level + i });
      }
    }

    // Store the heading data
    headingsData.push(headingData);
  }

  return headingsData;
};

/**
 * Collects the template links data.
 * @param firstLinkTemplate
 * @returns A {@link LinkData} array.
 */
export const collectLinksData = (firstLinkTemplate: Element) => {
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

    linksData.push({
      linkElement,
      level,
      component,
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
  const firstLinkComponent = collectLinkData(firstLinkTemplate);

  if (!linksData.length || !firstLinkComponent) return;

  // Get the table wrapper
  const tableWrapper = firstLinkComponent.parentElement;
  if (!tableWrapper) return;

  const anchor = new Comment(ANCHOR_SELECTOR);
  tableWrapper.insertBefore(anchor, firstLinkComponent);
  firstLinkComponent.remove();

  return [linksData, tableWrapper] as const;
};
