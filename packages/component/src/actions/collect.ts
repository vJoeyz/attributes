import { isNotEmpty } from '@finsweet/ts-utils';
import type { ComponentTarget } from 'src/utils/types';

import { getAttribute, getSelector } from '../utils/constants';

/**
 * Collects the component targets.
 */
export const collectComponentTargets = () => {
  const targetElements = document.querySelectorAll<HTMLElement>(getSelector('componentId'));
  const targetsData: ComponentTarget[] = [...targetElements]
    .map((element) => {
      const componentId = getAttribute(element, 'componentId');
      if (!componentId) return;

      const source = getAttribute(element, 'source');

      return { element, source, componentId };
    })
    .filter(isNotEmpty);

  return targetsData;
};
