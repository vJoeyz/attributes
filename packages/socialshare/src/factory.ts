import { CMS_CSS_CLASSES } from '@finsweet/ts-utils';
import { getInstanceIndex } from '@global/helpers';

import { collectFacebookData, collectPinterestData, collectSocialData, collectTwitterData } from './actions/collect';
import {
  createFacebookShare,
  createTwitterShare,
  createPinterestShare,
  createTelegramShare,
  createLinkedinShare,
  createRedditShare,
} from './actions/share';
import { ATTRIBUTES } from './utils/constants';

const {
  element: { key: elementKey },
} = ATTRIBUTES;

export function createFacebookButton(facebookButton: HTMLElement) {
  const instanceIndex = getInstanceIndex(facebookButton, elementKey);

  const cmsListItem = facebookButton.closest<HTMLElement>(`.${CMS_CSS_CLASSES.item}`) || undefined;

  const facebook = collectFacebookData(facebookButton, instanceIndex, cmsListItem);

  createFacebookShare(facebookButton, facebook);
}

export function createTwitterButton(twitterButton: HTMLElement) {
  const instanceIndex = getInstanceIndex(twitterButton, elementKey);

  const cmsListItem = twitterButton.closest<HTMLElement>(`.${CMS_CSS_CLASSES.item}`) || undefined;

  const twitter = collectTwitterData(twitterButton, instanceIndex, cmsListItem);

  createTwitterShare(twitterButton, twitter);
}

export function createPinterestButton(pinterestButton: HTMLElement) {
  const instanceIndex = getInstanceIndex(pinterestButton, elementKey);

  const cmsListItem = pinterestButton.closest<HTMLElement>(`.${CMS_CSS_CLASSES.item}`) || undefined;

  const pinterest = collectPinterestData(pinterestButton, instanceIndex, cmsListItem);

  createPinterestShare(pinterestButton, pinterest);
}

export function createTelegramButton(telegramButton: HTMLElement) {
  const instanceIndex = getInstanceIndex(telegramButton, elementKey);

  const cmsListItem = telegramButton.closest<HTMLElement>(`.${CMS_CSS_CLASSES.item}`) || undefined;

  const telegram = collectSocialData(telegramButton, 'telegram', instanceIndex, cmsListItem);

  createTelegramShare(telegramButton, telegram);
}

export function createLinkedinButton(linkedinButton: HTMLElement) {
  const instanceIndex = getInstanceIndex(linkedinButton, elementKey);

  const cmsListItem = linkedinButton.closest<HTMLElement>(`.${CMS_CSS_CLASSES.item}`) || undefined;

  const linkedin = collectSocialData(linkedinButton, 'linkedin', instanceIndex, cmsListItem);

  createLinkedinShare(linkedinButton, linkedin);
}

export function createRedditButton(redditButton: HTMLElement) {
  const instanceIndex = getInstanceIndex(redditButton, elementKey);

  const cmsListItem = redditButton.closest<HTMLElement>(`.${CMS_CSS_CLASSES.item}`) || undefined;

  const reddit = collectSocialData(redditButton, 'reddit', instanceIndex, cmsListItem);

  createRedditShare(redditButton, reddit);
}
