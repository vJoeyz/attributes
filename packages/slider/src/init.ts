import { awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';

import { initSlider } from './actions/slider';
import { swiperInstancesStore } from './utils/store';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  const sliderInstances = document.querySelectorAll('div[fs-slider-instance]');
  sliderInstances.forEach((element) => initSlider(element));

  return {
    result: swiperInstancesStore,
    destroy() {
      for (const [, swiperInstance] of swiperInstancesStore) {
        swiperInstance.destroy();
      }

      swiperInstancesStore.clear();
    },
  };
};
