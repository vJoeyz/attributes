import { getInstanceIndex } from '$global/helpers/instances';

import { collectHeadingsData, collectLinksData } from './actions/collect';
import { populateLinks } from './actions/populate';
import { ATTRIBUTES, getSelector, queryElement } from './utils/constants';

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
    const [linksData, tableWrapper] = collectLinksData(linkTemplate) || [];

    if (!headingsData.length || !linksData?.length || !tableWrapper) continue;

    console.log({ linkTemplate, headingsData, linksData, tableWrapper });

    populateLinks(headingsData, linksData, tableWrapper);
  }
};
