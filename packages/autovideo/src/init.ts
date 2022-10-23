import { addListener } from '@finsweet/ts-utils';

import { AUTO_VIDEO_ATTRIBUTE, CMS_ATTRIBUTE_ATTRIBUTE } from '$global/constants/attributes';
import { awaitAttributesLoad, finalizeAttribute } from '$global/factory';

import type { VideoStore } from './types';

/**
 * Inits the attribute.
 */
export const init = async () => {
  await awaitAttributesLoad(CMS_ATTRIBUTE_ATTRIBUTE);

  const videos = document.querySelectorAll('video');
  if (!videos.length) return;

  const videoStore: VideoStore = new Map();

  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (!(target instanceof HTMLVideoElement)) continue;

      if (isIntersecting) target.play();
      else target.pause();

      videoStore.set(target, isIntersecting);
    }
  }, {});

  for (const video of videos) {
    video.autoplay = false;
    videoStore.set(video, null);
    observer.observe(video);
  }

  const removeListener = addListener(document, 'visibilitychange', () => {
    for (const [video, playState] of videoStore) {
      if (document.hidden || !playState) video.pause();
      else video.play();
    }
  });

  return finalizeAttribute(AUTO_VIDEO_ATTRIBUTE, videoStore, () => {
    observer.disconnect();
    removeListener();
  });
};
