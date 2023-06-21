import { type FsAttributeInit, waitWebflowReady } from '@finsweet/attributes-utils';

import { listenCMSLoad } from './actions/cms';
import { initVideoHLS } from './actions/video';
import { hlsInstancesStore } from './utils/stores';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await waitWebflowReady();

  const videos = document.querySelectorAll('video');
  videos.forEach(initVideoHLS);

  await listenCMSLoad();

  return {
    result: hlsInstancesStore,
    destroy() {
      for (const [, hlsInstance] of hlsInstancesStore) {
        hlsInstance.destroy();
      }

      hlsInstancesStore.clear();
    },
  };
};
