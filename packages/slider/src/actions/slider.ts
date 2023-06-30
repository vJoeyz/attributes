import Swiper, {
  Autoplay,
  EffectCards,
  EffectCoverflow,
  EffectCreative,
  EffectCube,
  EffectFade,
  EffectFlip,
  Navigation,
  Pagination,
  Scrollbar,
  SwiperOptions,
  Thumbs,
} from 'swiper';

import { getPaginationBulletClass, renderFraction, transformPaginationType } from '../utils/helpers';
import { getAttribute, queryElement } from '../utils/selectors';
import { swiperInstancesStore } from '../utils/store';

export const initSlider = (instance: Element) => {
  const sliderElement = queryElement('slider', { scope: instance });
  if (swiperInstancesStore.get(sliderElement)) return;

  const prevButton = queryElement('button-previous', { scope: instance });
  const nextButton = queryElement('button-next', { scope: instance });
  const paginationWrapper = queryElement('pagination-wrapper', { scope: instance });

  //General
  const centeredSlides = getAttribute(sliderElement, 'centeredslides');
  const autoHeight = getAttribute(sliderElement, 'autoheight');
  const loop = getAttribute(sliderElement, 'loop');
  const simulateTouch = getAttribute(sliderElement, 'touch');
  const scrollbar = getAttribute(sliderElement, 'scrollbar');

  //Pagination
  const paginationType = getAttribute(sliderElement, 'paginationtype');
  const paginationClickable = getAttribute(sliderElement, 'paginationclickable');

  //Autoplay
  const autoPlay = getAttribute(sliderElement, 'autoplay');
  const autoPlayDelay = getAttribute(sliderElement, 'autoplaydelay');
  const autoPlayInteraction = getAttribute(sliderElement, 'autoplayinteraction');
  const autoPlayPause = getAttribute(sliderElement, 'autoplaypause');

  //Effects
  const effect = getAttribute(sliderElement, 'effect');
  const coverflowDepth = getAttribute(sliderElement, 'coverflowdepth');
  const coverflowModifier = getAttribute(sliderElement, 'coverflowmodifier');
  const coverflowRotate = getAttribute(sliderElement, 'coverflowrotate');
  const coverflowScale = getAttribute(sliderElement, 'coverflowscale');
  const coverflowShadows = getAttribute(sliderElement, 'coverflowshadows');
  const flipLimit = getAttribute(sliderElement, 'fliplimit');
  const flipShadows = getAttribute(sliderElement, 'flipshadows');
  const cubeShadow = getAttribute(sliderElement, 'cubeshadow');
  const cubeOffset = getAttribute(sliderElement, 'cubeoffset');
  const cubeScale = getAttribute(sliderElement, 'cubescale');
  const cardsOffset = getAttribute(sliderElement, 'cardsoffset');
  const cardsRotate = getAttribute(sliderElement, 'cardsrotate');
  const cardsShadows = getAttribute(sliderElement, 'cardsshadows');

  const paginationOptions = {
    el: paginationWrapper,
    type: transformPaginationType(paginationType),
    bulletClass: getPaginationBulletClass(paginationType),
    bulletActiveClass: 'is-active',
    clickable: paginationClickable || true,
    renderFraction,
    progressbarFillClass: 'slider_progressbar-active',
    renderProgressbar(progressbarFillClass) {
      return `<div class="${progressbarFillClass}"></div>`;
    },
  };

  const options: SwiperOptions = {
    modules: [
      Pagination,
      Navigation,
      Autoplay,
      Scrollbar,
      EffectFade,
      EffectCards,
      EffectFlip,
      EffectCube,
      EffectCoverflow,
      EffectCreative,
      Thumbs,
    ],
    wrapperClass: 'slider_cms-list w-dyn-items',
    slideClass: 'slider_cms-item',
    autoHeight,
    loop,
    simulateTouch,
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    centeredSlides,
    pagination: paginationWrapper ? paginationOptions : false,
    navigation: {
      nextEl: nextButton,
      prevEl: prevButton,
    },
    scrollbar: scrollbar
      ? {
          el: paginationWrapper,
          draggable: true,
        }
      : false,
    effect: effect,
    fadeEffect: {
      crossFade: true,
    },
    coverflowEffect: {
      depth: coverflowDepth,
      modifier: coverflowModifier,
      rotate: coverflowRotate,
      scale: coverflowScale,
      slideShadows: coverflowShadows,
    },
    flipEffect: {
      limitRotation: flipLimit,
      slideShadows: flipShadows,
    },
    cubeEffect: {
      shadow: cubeShadow,
      slideShadows: cubeOffset,
      shadowScale: cubeScale,
    },
    cardsEffect: {
      perSlideOffset: cardsOffset,
      perSlideRotate: cardsRotate,
      slideShadows: cardsShadows,
    },
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
