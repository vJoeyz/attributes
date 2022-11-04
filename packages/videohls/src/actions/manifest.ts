import { getAttribute } from '../utils/constants';

const HLS_FILE_EXTENSION_REGEX = /.*\.m3u8$/;

/**
 * @returns A URL of a `.m3u8` source file from a video, if existing.
 * @param video
 */
export const getHLSManifestURL = (video: HTMLVideoElement): string | undefined => {
  let hlsManifestURL: string | null | undefined = getAttribute(video, 'manifest');
  if (hlsManifestURL) return hlsManifestURL;

  const sources = video.querySelectorAll('source');

  hlsManifestURL = [video, ...sources].find(({ src }) => HLS_FILE_EXTENSION_REGEX.test(src))?.src;

  return hlsManifestURL;
};
