import { queryAllElements } from '../utils/selectors';

/**
 * Hides all `fs-launchdarkly-element="loader"` elements.
 */
export const hideLoaders = () => {
  const allElements = queryAllElements('loader');

  for (const element of allElements) {
    element.style.display = 'none';
  }
};
