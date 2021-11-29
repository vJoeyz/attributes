import { queryElement } from '../utils/constants';

/**
 * Hides the loader element.
 */
export const hideLoader = () => {
  const loader = queryElement('loader');
  if (!loader) return;

  loader.remove();
};
