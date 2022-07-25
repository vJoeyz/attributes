import type { FacebookSocialShare, PinterestSocialShare, SocialShare, TwitterSocialShare } from './../utils/types';

const FACEBOOK_URL = 'https://www.facebook.com/sharer/sharer.php';
const TWITTER_URL = 'https://twitter.com/intent/tweet/';
const PINTEREST_URL = 'https://www.pinterest.com/pin/create/trigger/';
const REDDIT_URL = 'https://www.reddit.com/submit';
const LINKEDIN_URL = 'https://www.linkedin.com//sharing/share-offsite';
const TELEGRAM_URL = 'https://t.me/share';

export function createFacebookShare(trigger: HTMLElement, facebook: FacebookSocialShare) {
  createSocialShare(
    trigger,
    FACEBOOK_URL,
    { u: facebook.url, hashtag: facebook.hashtags, quote: facebook.content },
    facebook.width,
    facebook.height
  );
}

export function createTwitterShare(trigger: HTMLElement, twitter: TwitterSocialShare) {
  createSocialShare(
    trigger,
    TWITTER_URL,
    {
      text: twitter.content,
      via: twitter.username,
      hashtags: twitter.hashtags,
      url: twitter.url,
    },
    twitter.width,
    twitter.height
  );
}

export function createPinterestShare(trigger: HTMLElement, pinterest: PinterestSocialShare) {
  createSocialShare(
    trigger,
    PINTEREST_URL,
    {
      url: pinterest.url,
      media: pinterest.image,
      description: pinterest.description,
    },
    pinterest.width,
    pinterest.height
  );
}

export function createLinkedinShare(trigger: HTMLElement, linkedin: SocialShare) {
  createSocialShare(trigger, LINKEDIN_URL, { url: linkedin.url }, linkedin.width, linkedin.height);
}

export function createRedditShare(trigger: HTMLElement, reddit: SocialShare) {
  createSocialShare(
    trigger,
    REDDIT_URL,
    {
      url: reddit.url,
      title: reddit.content,
    },
    reddit.width,
    reddit.height
  );
}

export function createTelegramShare(trigger: HTMLElement, telegram: SocialShare) {
  createSocialShare(
    trigger,
    TELEGRAM_URL,
    {
      text: telegram.content,
      url: telegram.url,
    },
    telegram.width,
    telegram.height
  );
}

function createSocialShare(
  trigger: HTMLElement,
  urlSocialMedia: string,
  params: { [key: string]: string | null },
  width: number,
  height: number
): void {
  trigger.addEventListener('click', function () {
    const shareUrl = new URL(urlSocialMedia);
    const shareParams = Object.entries(params);

    for (const [key, value] of shareParams) {
      if (value) shareUrl.searchParams.append(key, value);
    }

    const left = window.innerWidth / 2 - width / 2 + window.screenX;
    const top = window.innerHeight / 2 - height / 2 + window.screenY;
    const popParams = `scrollbars=no, width=${width}, height=${height}, top=${top}, left=${left}`;
    const newWindow = window.open(shareUrl, '', popParams);

    if (newWindow) {
      newWindow.focus();
    }
  });
}
