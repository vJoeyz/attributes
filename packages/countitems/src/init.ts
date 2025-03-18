import { CMS_CSS_CLASSES, type FinsweetAttributeInit, waitWebflowReady } from '@finsweet/attributes-utils';

import { getInstance, queryAllElements, queryElement } from './utils/selectors';

/**
 * Inits list items count.
 */
export const init: FinsweetAttributeInit = async () => {
  await waitWebflowReady();

  const listReferences = queryAllElements('list');

  for (const listReference of listReferences) {
    const listWrapper = listReference.closest(`.${CMS_CSS_CLASSES.wrapper}`);
    const listElement = listWrapper?.querySelector(`.${CMS_CSS_CLASSES.list}}`) || listReference;

    const instance = getInstance(listReference);

    const valueTarget = queryElement('value', { instance });
    if (!valueTarget) continue;

    const collectionItemsCount = listElement.children.length;

    valueTarget.textContent = `${collectionItemsCount}`;
  }

  return {
    result: listReferences,
  };
};
