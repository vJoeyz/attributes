// import { logHello } from './actions/console';
// import { getInstanceIndex } from '@global/helpers';
import { CMS_CSS_CLASSES } from '@finsweet/ts-utils';
import { getInstanceIndex } from '@global/helpers';

import { collectFacebookData, collectPinterestData, collectSocialData, collectTwitterData } from './actions/collect';
import { socialShareFactory } from './factory';
import { ATTRIBUTES, queryElement } from './utils/constants';

// Constants destructuring
const {
  element: { key: elementKey },
} = ATTRIBUTES;

/**
 * Inits the attribute.
 */
export const init = (): void => {
  document.addEventListener('DOMContentLoaded', () => {
    const contentElements = queryElement<HTMLElement>('content', { operator: 'prefixed', all: true });

    contentElements.forEach((contentElement) => {
      const instanceIndex = getInstanceIndex(contentElement, elementKey);

      const cmsListItem = contentElement.closest<HTMLElement>(`.${CMS_CSS_CLASSES.item}`) || undefined;

      const urlElement = queryElement<HTMLElement>('url', { operator: 'prefixed', scope: cmsListItem });

      const facebook = collectFacebookData(instanceIndex, cmsListItem);
      const twitter = collectTwitterData(instanceIndex, cmsListItem);
      const pinterest = collectPinterestData(instanceIndex, cmsListItem);
      const reddit = collectSocialData('reedit', instanceIndex, cmsListItem);
      const linkedin = collectSocialData('linkedin', instanceIndex, cmsListItem);
      const telegram = collectSocialData('telegram', instanceIndex, cmsListItem);

      const contentText = contentElement.innerText;
      const contentUrl = urlElement ? urlElement.innerText : window.location.href;

      socialShareFactory(contentText, contentUrl, facebook, twitter, pinterest, reddit, telegram, linkedin);
    });
  });
};
