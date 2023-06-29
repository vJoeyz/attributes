import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines an Swiper elements.
   */
  'slider',
  'button-previous',
  'button-next',
] as const satisfies AttributeElements;

export const SETTINGS = {
  autoheight: { key: 'autoheight', values: { true: 'true' } },
  slidesperview: { key: 'slidesperview' },
  slidespergroup: { key: 'slidespergroup' },
  initial: { key: 'initial' },
  loop: { key: 'loop', values: { true: 'true' } },
  touch: { key: 'touch', values: { true: 'true' } },
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
      fraction: 'count',
      progressbar: 'progress-bar',
    },
  },
} as const satisfies AttributeSettings;
