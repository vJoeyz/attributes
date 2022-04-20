import { cloneNode } from '@finsweet/ts-utils';

import { getInstanceIndex } from '$global/helpers/instances';

import { collectHeadingsData } from './actions/collect';
import { ATTRIBUTES, getSelector, queryElement } from './utils/constants';
import { extractHeadingLevel } from './utils/helpers';
import { HeadingData, LinkData } from './utils/types';

/**
 * Inits the attribute.
 */
export const init = (): void => {
  const contentsElements = document.querySelectorAll<HTMLElement>(
    getSelector('element', 'contents', { operator: 'prefixed' })
  );

  for (const contentsElement of contentsElements) {
    const instanceIndex = getInstanceIndex(contentsElement, ATTRIBUTES.element.key);
    const linkTemplate = queryElement('link', { instanceIndex });
    if (!linkTemplate) continue;

    const headingsData = collectHeadingsData(contentsElement);
    const templateLinksData = collectTemplateLinksData(linkTemplate);

    if (!headingsData.length || !templateLinksData) continue;

    console.log({ linkTemplate, headingsData, templateLinksData });
  }
};

const collectTemplateLinksData = (linkTemplate: Element) => {
  const linksData: LinkData[] = [];

  const collectLinkData = (referenceNode: Element) => {
    const linkElement = referenceNode.closest('a');
    if (!linkElement) return;

    const { parentElement } = linkElement;
    if (!parentElement) return;

    const previousLevel = linksData[linksData.length - 1]?.level;
    const subsequentLevel = previousLevel ? previousLevel + 1 : 2;
    const rawLevel = referenceNode.getAttribute(ATTRIBUTES.heading.key);

    let level = rawLevel ? extractHeadingLevel(rawLevel) : subsequentLevel;
    if (!level) return;

    // Make sure there are no level duplicates
    if (linksData.find((linkData) => linkData.level === level)) level = subsequentLevel;

    const ixTrigger = parentElement.querySelector<HTMLElement>(`:scope > ${ATTRIBUTES.element.values.ixTrigger}`);

    linksData.push({
      linkElement,
      level,
      parentElement,
      ixTrigger,
    });

    // Get next link data
    const followingTextNodes = [...parentElement.querySelectorAll(`* ${getSelector('element', 'link')}`)];
    const followingTextNode = followingTextNodes.find((node) => node !== referenceNode);

    if (followingTextNode) collectLinkData(followingTextNode);
  };

  // Init collection
  collectLinkData(linkTemplate);

  if (!linksData.length) return;

  // Get the table wrapper
  const [{ parentElement }] = linksData;
  const tableWrapper = parentElement.parentElement;
  if (!tableWrapper) return;

  return [linksData, tableWrapper] as const;
};

const populateLinks = (headingsData: HeadingData[], linksData: LinkData[], parentWrapper: HTMLElement) => {
  let levelMemo: LinkData | undefined;

  for (const { headingElement, level, children } of headingsData) {
    if (headingElement) {
      const linkData = linksData.find((data) => data.level === level);
      if (!linkData) continue;

      const linkElement = cloneNode(linkData.linkElement);
      const parentElement = levelMemo ? levelMemo.parentElement : parentWrapper;
    }
  }
};
