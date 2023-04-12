import { parseNumericAttribute } from '$global/helpers';
import type { CMSList } from '$packages/cmscore';

import { ATTRIBUTES, getAttribute, queryElement } from './utils/constants';

/**
 * Inits static elements for a CMSList.
 * @param listInstance
 */
export async function initStaticInstance(listInstance: CMSList) {
  const instanceIndex = listInstance.getInstanceIndex(ATTRIBUTES.element.key);

  const staticElements = queryElement<HTMLDivElement>('staticItem', { all: true, instanceIndex });

  const staticElementsData = staticElements.reduce<Parameters<CMSList['addStaticItems']>['0']>((acc, itemElement) => {
    const order = getAttribute(itemElement, 'order');

    const interactive = getAttribute(itemElement, 'interactive') === ATTRIBUTES.interactive.values.true;

    const rawRepeat = getAttribute(itemElement, 'repeat');
    const repeat = parseNumericAttribute(rawRepeat);

    const staticIndex = order === null ? 0 : parseInt(order);
    const targetIndex = isNaN(staticIndex) || staticIndex <= 0 ? 0 : staticIndex - 1;

    acc.push({
      itemElement,
      interactive,
      targetIndex,
      repeat,
    });

    return acc;
  }, []);

  await listInstance.addStaticItems(staticElementsData);
}
