import { addListener, isElement } from '@finsweet/attributes-utils';

import { SOCIAL_SHARE_PLATFORMS } from '../utils/constants';
import { getElementSelector } from '../utils/selectors';
import { stores } from '../utils/stores';
import type { SocialShareStoreData, SocialShareTypes } from '../utils/types';

/**
 * Listens for trigger clicks on the document.
 *
 * @returns A callback to remove the event listener.
 */
export const listenTriggerClicks = () => {
  const clickCleanup = addListener(document, 'click', (e) => {
    const { target } = e;
    if (!isElement(target)) return;

    for (const key in SOCIAL_SHARE_PLATFORMS) {
      const platform = key as SocialShareTypes;

      const trigger = target.closest<HTMLElement>(getElementSelector(platform));
      if (!trigger) continue;

      const socialShareData = stores[platform].get(trigger);
      if (socialShareData) triggerSocialShare(socialShareData);
      break;
    }
  });

  return clickCleanup;
};

/**
 * Triggers a social share.
 * @param storeData
 */
const triggerSocialShare = ({ width, height, shareUrl }: SocialShareStoreData) => {
  const left = window.innerWidth / 2 - width / 2 + window.screenX;
  const top = window.innerHeight / 2 - height / 2 + window.screenY;
  const popParams = `scrollbars=no, width=${width}, height=${height}, top=${top}, left=${left}`;
  const newWindow = window.open(shareUrl, '', popParams);

  if (newWindow) {
    newWindow.focus();
  }
};
