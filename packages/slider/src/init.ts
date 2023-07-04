import { type FsAttributeInit, waitWebflowReady } from '@finsweet/attributes-utils';

import { initSlider } from './actions/slider';
import { queryAllElements } from './utils/selectors';
import { swiperInstancesStore } from './utils/store';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await waitWebflowReady();

  const sliderElements = queryAllElements<HTMLElement>('slider');

  sliderElements.forEach((element) => initSlider(element));

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
