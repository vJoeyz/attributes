import { ATTRIBUTE as CMS_LOAD_ATTRIBUTE } from '@finsweet/attributes-cmsload/src/utils/constants';
import type { CMSList } from 'packages/cmscore/src';

import {
  createFacebookButton,
  createLinkedinButton,
  createPinterestButton,
  createRedditButton,
  createTelegramButton,
  createTwitterButton,
} from './factory';
import { ATTRIBUTE, queryElement } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<void> => {
  // create button for static items
  const facebookElements = [...queryElement<HTMLElement>('facebook', { operator: 'prefixed', all: true })];
  facebookElements.forEach(createFacebookButton);

  const twitterElements = [...queryElement<HTMLElement>('twitter', { operator: 'prefixed', all: true })];
  twitterElements.forEach(createTwitterButton);

  const pinterestElements = [...queryElement<HTMLElement>('pinterest', { operator: 'prefixed', all: true })];
  pinterestElements.forEach(createPinterestButton);

  const linkekInElements = [...queryElement<HTMLElement>('linkedin', { operator: 'prefixed', all: true })];
  linkekInElements.forEach(createLinkedinButton);

  const redditElements = [...queryElement<HTMLElement>('reddit', { operator: 'prefixed', all: true })];
  redditElements.forEach(createLinkedinButton);

  const telegramElements = [...queryElement<HTMLElement>('telegram', { operator: 'prefixed', all: true })];
  telegramElements.forEach(createTelegramButton);

  // create button from dynamic list in memory
  const listInstances: CMSList[] = (await window.fsAttributes[CMS_LOAD_ATTRIBUTE]?.loading) || [];

  for (const { items } of listInstances) {
    for (const { element } of items) {
      const facebookItemElements = [
        ...queryElement<HTMLElement>('facebook', { operator: 'prefixed', all: true, scope: element }),
      ];
      facebookItemElements.forEach(createFacebookButton);

      const twitterItemElements = [
        ...queryElement<HTMLElement>('twitter', { operator: 'prefixed', all: true, scope: element }),
      ];
      twitterItemElements.forEach(createTwitterButton);

      const pinterestElements = [
        ...queryElement<HTMLElement>('pinterest', { operator: 'prefixed', all: true, scope: element }),
      ];
      pinterestElements.forEach(createPinterestButton);

      const linkedinElements = [
        ...queryElement<HTMLElement>('linkedin', { operator: 'prefixed', all: true, scope: element }),
      ];
      linkedinElements.forEach(createLinkedinButton);

      const redditElements = [
        ...queryElement<HTMLElement>('reddit', { operator: 'prefixed', all: true, scope: element }),
      ];
      redditElements.forEach(createRedditButton);

      const telegramElements = [
        ...queryElement<HTMLElement>('telegram', { operator: 'prefixed', all: true, scope: element }),
      ];
      telegramElements.forEach(createTelegramButton);
    }
  }

  window.fsAttributes[ATTRIBUTE].resolve?.(undefined);
};
