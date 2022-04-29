import { restartWebflow } from '@finsweet/ts-utils';

import { getInstanceIndex } from '$global/helpers/instances';

import { collectHeadingsData, collectLinksData } from './actions/collect';
import { observeContents, observeHeadings } from './actions/observe';
import { populateLinks } from './actions/populate';
import { scrollToAnchor, setScrollOffsets } from './actions/scroll';
import { ATTRIBUTES, getSelector, queryElement } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<void> => {
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

    // Observer
    observeHeadings(tocItems);
    // observeContents(contentsElement, tableComponents);

    // URL hash Anchor
    scrollToAnchor();

    // await restartWebflow();

    console.log({ linkTemplate, headingsData, linksData, tocWrapper, tocItems });
  }
};
