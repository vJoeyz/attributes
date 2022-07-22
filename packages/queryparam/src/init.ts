import { queryParamFactory } from './factory';
import { ATTRIBUTES } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = (): void => {
  const url = new URL(window.location.href);

  for (const [paramKey, paramValue] of [...url.searchParams]) {
    const queryParamElements = [...document.querySelectorAll<HTMLElement>(`[${ATTRIBUTES.name.key}="${paramKey}"]`)];

    if (queryParamElements.length < 1) {
      continue;
    }

    queryParamFactory(queryParamElements, paramValue);

    const removeParamFromUrl = queryParamElements.some((element) => {
      return element.hasAttribute(ATTRIBUTES.removeQuery.key);
    });

    if (removeParamFromUrl) {
      url.searchParams.delete(paramKey);
    }
  }

  history.replaceState(null, '', url.toString());
};
