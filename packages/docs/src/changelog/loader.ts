import { getSelector } from '../utils/constants';

/**
 * Hides the loader element.
 */
export const hideLoader = () => {
  const loader = document.querySelector(getSelector('element', 'loader'));
  if (!loader) return;

  loader.remove();
};
