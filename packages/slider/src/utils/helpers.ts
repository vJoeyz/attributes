import type { PaginationOptions } from 'swiper/types/modules/pagination';

export const transformPaginationType = (paginationType: string): PaginationOptions['type'] => {
  switch (paginationType) {
    case 'bullets':
      return 'bullets';
    case 'count':
      return 'fraction';
    case 'progress-bar':
      return 'progressbar';
    case 'thumbs':
      return 'custom';
    default:
      return 'custom';
  }
};

export const getPaginationBulletClass = (paginationType: string): string => {
  let bulletClass = '';
  switch (paginationType) {
    case 'bullets':
      bulletClass = 'dot';
      break;
    case 'thumbs':
      bulletClass = 'thumb';
      break;
    default:
      bulletClass = 'dot';
  }
  return `slider_pagination-${bulletClass}`;
};

export const renderFraction = (currentClass: string, totalClass: string) => {
  return (
    `<div fs-slider-element="pagination-current" class="heading-style-h4 ${currentClass}">-</div>` +
    '<div class="heading-style-h4">/</div>' +
    `<div fs-slider-element="pagination-total" class="heading-style-h4 ${totalClass}">-</div>`
  );
};

export const getBreakpointParams = (
  str: string | null
): {
  slidesPerView: number | 'auto';
  slidesPerGroup: number;
  spaceBetween: string;
} => {
  if (!str) return { slidesPerView: 'auto', slidesPerGroup: 1, spaceBetween: '0' };
  const values = str.split(',');
  const slidesPerView = parseFloat(values[0]);
  const slidesPerGroup = parseFloat(values[1]);
  const spaceBetween = values[2];
  return { slidesPerView, slidesPerGroup, spaceBetween };
};
