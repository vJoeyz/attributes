import Swiper, { Autoplay, EffectFade, Navigation, Pagination, SwiperOptions } from 'swiper';

import { getPaginationBulletClass, renderFraction, transformPaginationType } from "../utils/helpers";
import { getAttribute, queryElement } from '../utils/selectors';
import { swiperInstancesStore } from '../utils/store';

export const initSlider = (instance: Element) => {
  const sliderElement = queryElement('slider', { scope: instance });
  if (swiperInstancesStore.get(sliderElement)) return;

  const prevButton = queryElement('button-previous', { scope: instance });
  const nextButton = queryElement('button-next', { scope: instance });
  const paginationWrapper = queryElement('pagination-wrapper', { scope: instance });

  const paginationType = getAttribute(sliderElement, 'paginationtype');
  const autoHeight = getAttribute(sliderElement, 'autoheight');
  const autoPlay = getAttribute(sliderElement, 'autoplay');
  const autoPlayDelay = getAttribute(sliderElement, 'autoplaydelay');
  const autoPlayInteraction = getAttribute(sliderElement, 'autoplayinteraction');
  const autoPlayPause = getAttribute(sliderElement, 'autoplaypause');
  const effect = getAttribute(sliderElement, 'effect');

  const paginationOptions = {
    el: paginationWrapper,
    type: transformPaginationType(paginationType),
    bulletClass: getPaginationBulletClass(paginationType),
    bulletActiveClass: 'is-active',
    clickable: true,
    renderFraction,
    progressbarFillClass: 'slider_progressbar-active',
    renderProgressbar(progressbarFillClass) {
      return `<div class="${progressbarFillClass}"></div>`;
    },
  };

  const options: SwiperOptions = {
    modules: [Pagination, Navigation, Autoplay, EffectFade],
    wrapperClass: 'slider_cms-list w-dyn-items',
    slideClass: 'slider_cms-item',
    autoHeight: autoHeight,
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    pagination: paginationWrapper ? paginationOptions : false,
    navigation: {
      nextEl: nextButton,
      prevEl: prevButton,
    },
    effect: effect,
    autoplay: autoPlay
      ? {
          delay: autoPlayDelay,
          disableOnInteraction: autoPlayInteraction,
          pauseOnMouseEnter: autoPlayPause,
        }
      : false,
  };

  const sliderInstance = new Swiper(sliderElement, options);

  swiperInstancesStore.set(sliderElement, sliderInstance);

  return sliderInstance;
};
