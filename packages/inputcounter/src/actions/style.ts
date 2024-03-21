import { HIDE_ARROWS_STYLE } from '../utils/constants';
import { queryElement } from '../utils/selectors';

/**
 * Adds to the `<head>` the CSS style to hide the input arrows.
 */
export const addHideArrowsStylesheet = () => {
  const existing = queryElement<HTMLStyleElement>('style');
  if (existing) return;

  document.head.insertAdjacentHTML('beforeend', HIDE_ARROWS_STYLE);
};
