import 'swiper/css';
import 'swiper/swiper-bundle.css';

import Swiper, { SwiperOptions } from 'swiper';

import { getAttribute } from '../utils/selectors';
import { swiperInstancesStore } from '../utils/store';

export const initSlider = (element: HTMLElement) => {
  if (swiperInstancesStore.get(element)) return;

  const paginationType = getAttribute(element, 'paginationtype');
  const autoHeight = getAttribute(element, 'autoheight');

  const paginationOptions = {
    el: '.slider_button-wrapper' as HTMLElement,
    type: paginationType as 'bullets' | 'fraction' | 'progressbar' | 'custom',
  };

  const options: SwiperOptions = {
    wrapperClass: 'slider_grid w-dyn-items',
    slideClass: 'slider_grid-item',
    pagination: paginationOptions,
    autoHeight: autoHeight,
  };

  const sliderInstance = new Swiper(element, options);
  swiperInstancesStore.set(element, sliderInstance);

  return sliderInstance;
};
