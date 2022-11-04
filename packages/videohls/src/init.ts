import { CMS_ATTRIBUTE_ATTRIBUTE, VIDEO_HLS_ATTRIBUTE } from '$global/constants/attributes';
import { awaitAttributesLoad, finalizeAttribute } from '$global/factory';

import { listenCMSLoad } from './actions/cms';
import { initVideoHLS } from './actions/video';

/**
 * Inits the attribute.
 */
export const init = async () => {
  await awaitAttributesLoad(CMS_ATTRIBUTE_ATTRIBUTE);

  const videos = document.querySelectorAll('video');

  const hlsInstances = [...videos].map(initVideoHLS);

  listenCMSLoad(hlsInstances);

  return finalizeAttribute(VIDEO_HLS_ATTRIBUTE, hlsInstances, () => {
    for (const hlsInstance of hlsInstances) hlsInstance?.destroy();
  });
};
