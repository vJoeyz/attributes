import Hls from 'hls.js';

import { getHLSManifestURL } from './actions/manifest';

/**
 * Inits hls.js on a video that supports it.
 * @param video
 *
 * @returns The HLS instance.
 */
export const initVideoHLS = (video: HTMLVideoElement) => {
  if (video.canPlayType('application/vnd.apple.mpegurl') || !Hls.isSupported()) return;

  const hlsManifestURL = getHLSManifestURL(video);
  if (!hlsManifestURL) return;

  const hlsInstance = new Hls();

  hlsInstance.loadSource(hlsManifestURL);
  hlsInstance.attachMedia(video);

  return hlsInstance;
};
