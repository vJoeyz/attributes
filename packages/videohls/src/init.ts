import { type FinsweetAttributeInit, waitWebflowReady } from '@finsweet/attributes-utils';

import { listenListLoad } from './actions/list';
import { initVideoHLS } from './actions/video';
import { hlsInstancesStore } from './utils/stores';

/**
 * Inits the attribute.
 */
export const init: FinsweetAttributeInit = async () => {
  await waitWebflowReady();

  const videos = document.querySelectorAll('video');
  videos.forEach(initVideoHLS);

  await listenListLoad();

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
