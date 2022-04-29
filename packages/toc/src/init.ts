import { restartWebflow } from '@finsweet/ts-utils';
import { ATTRIBUTE as RICH_TEXT_ATTRIBUTE } from 'packages/richtext/src/utils/constants';

import { getInstanceIndex } from '$global/helpers/instances';

import { collectHeadingsData, collectLinksData } from './actions/collect';
import { observeLinksState } from './actions/observe';
import { populateLinks } from './actions/populate';
import { scrollToAnchor, setScrollOffsets } from './actions/scroll';
import { preventURLHash } from './actions/url';
import { ATTRIBUTE, ATTRIBUTES, getSelector, queryElement } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<void> => {
  await window.fsAttributes[RICH_TEXT_ATTRIBUTE]?.loading;

  const contentsElements = document.querySelectorAll<HTMLElement>(
    getSelector('element', 'contents', { operator: 'prefixed' })
  );

  for (const contentsElement of contentsElements) {
    const instanceIndex = getInstanceIndex(contentsElement, ATTRIBUTES.element.key);

    const linkTemplate = queryElement('link', { instanceIndex });
    if (!linkTemplate) continue;

    const headingsData = collectHeadingsData(contentsElement);
    const [linksData, tocWrapper] = collectLinksData(linkTemplate) || [];

    if (!headingsData.length || !linksData?.length || !tocWrapper) continue;

    const tocItems = populateLinks(headingsData, linksData, tocWrapper);

    // Scroll offset
    const scrollMarginTop = contentsElement.getAttribute(ATTRIBUTES.scrollMarginTop.key) || undefined;
    const scrollMarginBottom = contentsElement.getAttribute(ATTRIBUTES.scrollMarginBottom.key) || undefined;

    setScrollOffsets(tocWrapper, tocItems, { scrollMarginTop, scrollMarginBottom });

    // Hide URL Hash
    const hideURLHash = contentsElement.getAttribute(ATTRIBUTES.hideURLHash.key) === ATTRIBUTES.hideURLHash.values.true;
    if (hideURLHash) preventURLHash(tocWrapper);

    // Link States
    observeLinksState(tocWrapper, tocItems);

    // URL hash Anchor
    scrollToAnchor();
  }

  await restartWebflow();

  // TODO: Finish API
  window.fsAttributes[ATTRIBUTE].resolve?.(undefined);
};
