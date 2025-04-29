import { waitAttributeLoaded } from '@finsweet/attributes-utils';
import { initVideoHLS } from './video';
import type { List } from '@finsweet/attributes-list';

/**
 * Listens for newly added videos via CMS Load and inits an hls.js instance for them.
 *
 * **Important:** Mutates the passed {@link hlsInstances} array by pushing the new instances to it.
 *
 */
export const listenListLoad = async () => {
  const listInstances: List[] = (await waitAttributeLoaded('list')) || [];

  listInstances.map((listInstance) => {
    listInstance.addHook('afterRender', (items) => {
      for (const { element } of items) {
        const videos = element.querySelectorAll('video');
        videos.forEach(initVideoHLS);
      }
    });
  });
};
