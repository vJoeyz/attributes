import Swiper, { SwiperOptions, Pagination } from 'swiper';

import { getAttribute, queryElement } from '../utils/selectors';
import { swiperInstancesStore } from '../utils/store';

export const initSlider = (instance: Element) => {
  const sliderElement = queryElement('slider', { scope: instance });
  const prevButton = queryElement('button-previous', { scope: instance });
  const nextButton = queryElement('button-next', { scope: instance });
  const paginationWrapper = queryElement('pagination-wrapper', { scope: instance });

  if (swiperInstancesStore.get(sliderElement)) return;

  const paginationType = getAttribute(sliderElement, 'paginationtype');
  const autoHeight = getAttribute(sliderElement, 'autoheight');

  const paginationOptions = {
    el: paginationWrapper,
    type: paginationType as 'bullets' | 'fraction' | 'progressbar' | 'custom',
    bulletClass: 'slider_pagination-dot',
    bulletActiveClass: 'is-active',
    clickable: true,
    renderBullet: function (index, className) {
      return `<div fs-slider-element="active-pagination-bullet" class="${className}"></div>`;
    },
  };

  const options: SwiperOptions = {
    modules: [Pagination],
    wrapperClass: 'slider_cms-list w-dyn-items',
    slideClass: 'slider_cms-item',
    autoHeight: autoHeight,
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    pagination: paginationOptions,
  };

  const sliderInstance = new Swiper(sliderElement, options);

  prevButton.addEventListener('click', () => {
    sliderInstance.slidePrev();
  });

  nextButton.addEventListener('click', () => {
    sliderInstance.slideNext();
  });

  swiperInstancesStore.set(sliderElement, sliderInstance);

  return sliderInstance;
};
