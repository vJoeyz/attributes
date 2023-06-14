import { awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';
import { isNotEmpty } from '@finsweet/ts-utils';

import { initFormInstance } from './factory';
import { queryAllElements } from './utils/selectors';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  const formElements = queryAllElements('form');

  const formInstances = formElements.map(initFormInstance).filter(isNotEmpty);

  return {
    result: formInstances,
    destroy() {
      for (const formInstance of formInstances) {
        formInstance.destroy();
      }
    },
  };
};
