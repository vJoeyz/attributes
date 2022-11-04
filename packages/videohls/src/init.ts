import { CMS_ATTRIBUTE_ATTRIBUTE, VIDEO_HLS_ATTRIBUTE } from '$global/constants/attributes';
import { awaitAttributesLoad, finalizeAttribute } from '$global/factory';
import { importCMSCore } from '$global/import';

import { initVideoHLS } from './factory';
import { CMS_LOAD_LIST_ELEMENT_SELECTOR } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async () => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  await awaitAttributesLoad(CMS_ATTRIBUTE_ATTRIBUTE);

  const videos = document.querySelectorAll('video');

  const hlsInstances = [...videos].map(initVideoHLS);

  const listInstances = cmsCore.createCMSListInstances([CMS_LOAD_LIST_ELEMENT_SELECTOR]);

  listInstances.map((listInstance) => {
    listInstance.on('additems', (addedItems) => {
      for (const { element } of addedItems) {
        const videos = element.querySelectorAll('video');

        for (const video of videos) {
          hlsInstances.push(initVideoHLS(video));
        }
      }
    });
  });

  return finalizeAttribute(VIDEO_HLS_ATTRIBUTE, hlsInstances, () => {
    for (const hlsInstance of hlsInstances) hlsInstance?.destroy();
  });
};
