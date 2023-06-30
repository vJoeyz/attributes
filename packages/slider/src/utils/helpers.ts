import { TPagination } from './types';

export const transformPaginationType = (paginationType: string): TPagination => {
  switch (paginationType) {
    case 'bullets':
      return 'bullets';
    case 'count':
      return 'fraction';
    case 'progress-bar':
      return 'progressbar';
    case 'thumbnails':
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
    case 'thumbnails':
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
