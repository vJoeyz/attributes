import { queryParamFactory } from './factory';
import { ATTRIBUTES } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = (): void => {
  const urlParams = new URLSearchParams(window.location.search);

  const paramsToDelete = [];

  for (const [paramKey, paramValue] of urlParams) {
    const queryParamElements = [...document.querySelectorAll<HTMLElement>(`[${ATTRIBUTES.name.key}="${paramKey}"]`)];

    if (queryParamElements.length < 1) {
      continue;
    }

    queryParamFactory(queryParamElements, paramValue);

    const removeParamFromUrl = queryParamElements.some((element) => {
      return element.hasAttribute(ATTRIBUTES.removequery.key);
    });

    if (removeParamFromUrl) {
      paramsToDelete.push(paramKey);
    }
  }

  for (const paramKey of paramsToDelete) {
    urlParams.delete(paramKey);
  }

  history.replaceState(null, '', '?' + urlParams.toString());
};
