import Swiper from 'swiper';
import {
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
  Thumbs,
} from 'swiper/modules';
import type { PaginationOptions } from 'swiper/types/modules/pagination';
import type { SwiperOptions } from 'swiper/types/swiper-options';

import { getBreakpointParams, getPaginationBulletClass, transformPaginationType } from '../utils/helpers';
import { getAttribute, getInstanceIndex, queryElement } from '../utils/selectors';
import { swiperInstancesStore } from '../utils/store';

export const initSlider = (sliderElement: HTMLElement) => {
  if (swiperInstancesStore.get(sliderElement)) return;

  const instanceIndex = getInstanceIndex(sliderElement);

  //Navigation
  const prevButton = queryElement('button-previous', { instanceIndex });
  const nextButton = queryElement('button-next', { instanceIndex });

  //General
  const centeredSlides = getAttribute(sliderElement, 'centeredslides');
  const autoHeight = getAttribute(sliderElement, 'autoheight');
  const loop = getAttribute(sliderElement, 'loop');
  const simulateTouch = getAttribute(sliderElement, 'touch');
  const scrollbar = getAttribute(sliderElement, 'scrollbar');

  //Pagination
  const paginationWrapper = queryElement('pagination-wrapper', { instanceIndex });
  const paginationType = getAttribute(sliderElement, 'paginationtype') || 'bullets';
  const paginationClickable = getAttribute(sliderElement, 'paginationclickable');

  //Autoplay
  const autoPlay = getAttribute(sliderElement, 'autoplay');
  const autoPlayDelay = getAttribute(sliderElement, 'autoplaydelay');
  const autoPlayInteraction = getAttribute(sliderElement, 'autoplayinteraction');
  const autoPlayPause = getAttribute(sliderElement, 'autoplaypause');

  //Breakpoints
  const mobilePortrait = getAttribute(sliderElement, 'mobileportrait');
  const mobileLandscape = getAttribute(sliderElement, 'mobilelandscape');
  const tablet = getAttribute(sliderElement, 'tablet');
  const desktop = getAttribute(sliderElement, 'desktop');
  const mdsize = getAttribute(sliderElement, '1280');
  const lgsize = getAttribute(sliderElement, '1440');
  const xlsize = getAttribute(sliderElement, '1920');
  const mobilePortraitParams = getBreakpointParams(mobilePortrait);
  const mobileLandscapeParams = getBreakpointParams(mobileLandscape);
  const tabletParams = getBreakpointParams(tablet);
  const desktopParams = getBreakpointParams(desktop);
  const mdParams = getBreakpointParams(mdsize);
  const lgParams = getBreakpointParams(lgsize);
  const xlParams = getBreakpointParams(xlsize);

  //Effects
  const effect = getAttribute(sliderElement, 'effect') || undefined;
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

  const breakpointsOptions = {
    300: {
      slidesPerView: mobilePortraitParams.slidesPerView,
      slidesPerGroup: mobilePortraitParams.slidesPerGroup,
      spaceBetween: mobilePortraitParams.spaceBetween,
    },
    480: {
      slidesPerView: mobileLandscapeParams.slidesPerView,
      slidesPerGroup: mobileLandscapeParams.slidesPerGroup,
      spaceBetween: mobileLandscapeParams.spaceBetween,
    },
    767: {
      slidesPerView: tabletParams.slidesPerView,
      slidesPerGroup: tabletParams.slidesPerGroup,
      spaceBetween: tabletParams.spaceBetween,
    },
    960: {
      slidesPerView: desktopParams.slidesPerView,
      slidesPerGroup: desktopParams.slidesPerGroup,
      spaceBetween: desktopParams.spaceBetween,
    },
    1280: {
      slidesPerView: mdParams.slidesPerView,
      slidesPerGroup: mdParams.slidesPerGroup,
      spaceBetween: mdParams.spaceBetween,
    },
    1440: {
      slidesPerView: lgParams.slidesPerView,
      slidesPerGroup: lgParams.slidesPerGroup,
      spaceBetween: lgParams.spaceBetween,
    },
    1920: {
      slidesPerView: xlParams.slidesPerView,
      slidesPerGroup: xlParams.slidesPerGroup,
      spaceBetween: xlParams.spaceBetween,
    },
  };

  const paginationOptions: PaginationOptions = {
    el: paginationWrapper,
    type: transformPaginationType(paginationType),
    bulletClass: getPaginationBulletClass(paginationType),
    bulletActiveClass: 'is-active',
    clickable: !!paginationClickable || true,
    renderFraction: (currentClass: string, totalClass: string) => {
      if (!paginationWrapper) return '';
      const current = queryElement('pagination-current', { scope: paginationWrapper });
      const total = queryElement('pagination-total', { scope: paginationWrapper });
      current?.classList.add(currentClass);
      total?.classList.add(totalClass);
      return paginationWrapper.innerHTML;
    },
    progressbarFillClass: 'slider_progressbar-active',
    renderProgressbar() {
      const activeProgressBar = queryElement('active-progress-bar', { instanceIndex });
      if (!activeProgressBar) return '';
      activeProgressBar.style.transformOrigin = 'left top';
      activeProgressBar.style.width = '100%';
      return activeProgressBar.outerHTML;
    },
  };

  const scrollOptions = {
    el: paginationWrapper,
    draggable: true,
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
    wrapperClass: sliderElement.firstElementChild?.className || 'slider_cms-list w-dyn-items',
    slideClass: 'slider_cms-item',
    autoHeight: !!autoHeight,
    loop: !!loop,
    simulateTouch: !!simulateTouch,
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    breakpoints: breakpointsOptions,
    centeredSlides: !!centeredSlides,
    pagination: paginationWrapper ? paginationOptions : false,
    navigation: {
      nextEl: nextButton,
      prevEl: prevButton,
    },
    scrollbar: scrollbar ? scrollOptions : false,
    effect: effect,
    fadeEffect: {
      crossFade: true,
    },
    coverflowEffect: {
      depth: Number(coverflowDepth),
      modifier: Number(coverflowModifier),
      rotate: Number(coverflowRotate),
      scale: Number(coverflowScale),
      slideShadows: !!coverflowShadows,
    },
    flipEffect: {
      limitRotation: !!flipLimit,
      slideShadows: !!flipShadows,
    },
    cubeEffect: {
      shadow: !!cubeShadow,
      slideShadows: !!cubeOffset,
      shadowScale: Number(cubeScale),
    },
    cardsEffect: {
      perSlideOffset: Number(cardsOffset),
      perSlideRotate: Number(cardsRotate),
      slideShadows: !!cardsShadows,
    },
    autoplay: autoPlay
      ? {
          delay: Number(autoPlayDelay),
          disableOnInteraction: !!autoPlayInteraction,
          pauseOnMouseEnter: !!autoPlayPause,
        }
      : false,
  };

  const sliderInstance = new Swiper(sliderElement, options);
  swiperInstancesStore.set(sliderElement, sliderInstance);

  return sliderInstance;
};
