import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines an Swiper elements.
   */
  'slider',
  'button-previous',
  'button-next',
  'pagination-thumbnails',
] as const satisfies AttributeElements;

export const SETTINGS = {
  autoheight: { key: 'autoheight', values: { true: 'true' } },
  slidesperview: { key: 'slidesperview' },
  slidespergroup: { key: 'slidespergroup' },
  initial: { key: 'initial' },
  loop: { key: 'loop', values: { true: 'true' } },
  touch: { key: 'touch', values: { true: 'true' } },
  scrollbar: { key: 'scrollbar', values: { true: 'true' } },
  centeredslides: { key: 'centeredslides' },
  slideclass: { key: 'slideclass' },
  activeslideclass: { key: 'activeslideclass' },
  speed: { key: 'speed' },
  direction: {
    key: 'direction',
    values: {
      horizontal: 'horizontal',
      vertical: 'vertical',
    },
  },

  autoplay: { key: 'autoplay', values: { true: 'true' } },
  autoplaydelay: { key: 'autoplaydelay' },
  autoplayinteraction: { key: 'autoplayinteraction', values: { true: 'true' } },
  autoplaypause: { key: 'autoplaypause', values: { true: 'true' } },
  pauseonhover: { key: 'pauseonhover', values: { true: 'true' } },

  paginationtype: {
    key: 'paginationtype',
    values: {
      bullets: 'bullets',
      count: 'count',
      progressbar: 'progress-bar',
    },
  },
  paginationclickable: { key: 'paginationclickable', values: { true: 'true' } },

  effect: { key: 'effect' },
  coverflowdepth: { key: 'coverflowdepth' },
  coverflowmodifier: { key: 'coverflowmodifier' },
  coverflowrotate: { key: 'coverflowrotate' },
  coverflowscale: { key: 'coverflowscale' },
  coverflowshadows: { key: 'coverflowshadows', values: { true: 'true' } },
  cubeshadow: { key: 'cubeshadow', values: { true: 'true' } },
  cubeoffset: { key: 'cubeoffset' },
  cubescale: { key: 'cubescale' },
  cardsoffset: { key: 'cardsoffset' },
  cardsrotate: { key: 'cardsrotate' },
  cardsshadows: { key: 'cardsshadows' },
  fliplimit: { key: 'fliplimit', values: { true: 'true' } },
  flipshadows: { key: 'flipshadows', values: { true: 'true' } },
} as const satisfies AttributeSettings;
