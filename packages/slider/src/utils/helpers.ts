import type { PaginationOptions } from 'swiper/types/modules/pagination';

/**
 * Transforms pagination type that comes from the HTML element.
 * In to type that is supported by Swiper library
 * @param paginationType
 * @returns Returns Swiper pagination type.
 */
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

/**
 * @returns The class required by Swiper library for bullets type pagination.
 * @param paginationType
 */
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

/**
 * @returns Swiper breakpoints parameters from string
 * with structure slidesPerView,SlidesperGroup,spaceBetween
 * @param strWithParams
 */
export const getBreakpointParams = (
  strWithParams: string | null
): {
  slidesPerView: number | 'auto';
  slidesPerGroup: number;
  spaceBetween: string;
} => {
  if (!strWithParams) return { slidesPerView: 'auto', slidesPerGroup: 1, spaceBetween: '0' };
  const values = strWithParams.split(',');
  const slidesPerView = parseFloat(values[0]);
  const slidesPerGroup = parseFloat(values[1]);
  const spaceBetween = values[2];
  return { slidesPerView, slidesPerGroup, spaceBetween };
};
