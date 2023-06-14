import { createCMSListInstances } from '@finsweet/attributes-cmscore';
import { normalizePropKey } from '@finsweet/attributes-utils';
import { type CollectionItemElement, extractCommaSeparatedValues } from '@finsweet/ts-utils';

import { getAttribute, getElementSelector, getSettingSelector } from '../utils/selectors';
import type { ExternalNestTargets, ManualNestTargets, NestSources } from '../utils/types';

/**
 * Queries the existing CMS Collections on the page that will be nested inside the main list instance.
 * @returns A `Map` with the `collectionKey` as the keys and `CMSList` instances as the values.
 */
export const getNestSources = (): NestSources => {
  const nestSources: NestSources = new Map();

  const listInstances = createCMSListInstances([getSettingSelector('collection')]);

  for (const listInstance of listInstances) {
    const collectionId = normalizePropKey(getAttribute(listInstance.listOrWrapper, 'collection'));
    if (!collectionId) continue;

    const emptyElement = document.querySelector<HTMLElement>(getSettingSelector('empty', undefined, collectionId));
    if (emptyElement) emptyElement.style.display = 'none';
    listInstance.wrapper.style.display = 'none';

    nestSources.set(collectionId, { listInstance, emptyElement });
  }

  return nestSources;
};

/**
 * Queries the target elements where the nested CMS Collections will be appended.
 * @param itemElement The `CollectionItemElement`.
 * @returns A `Map` with the `collectionKey` as the keys and `HTMLElement` targets as the values.
 */
export const getNestTargets = (itemElement: CollectionItemElement) => {
  // Query nest targets
  const nestTargetElements = itemElement.querySelectorAll<HTMLElement>(`${getSettingSelector('collection')}:not(a)`);

  // Group nest targets by collection
  const targetsByCollection = [...nestTargetElements].reduce((acc, nestTarget) => {
    const collectionId = normalizePropKey(getAttribute(nestTarget, 'collection'));
    if (!collectionId) return acc;

    const nestTargets = acc.get(collectionId) || [];

    nestTargets.push(nestTarget);

    acc.set(collectionId, nestTargets);

    return acc;
  }, new Map<string, HTMLElement[]>());

  // Determine if the slugs are defined manually or have to be fetched
  const manualNestTargets: ManualNestTargets = new Map();
  const externalNestTargets: ExternalNestTargets = new Map();

  for (const [collectionId, nestTargets] of targetsByCollection) {
    const nestTarget = nestTargets.find((nestTarget) => nestTarget.matches(getElementSelector('nest-target')));
    const slugsElement = nestTargets.find((nestTarget) => nestTarget.matches(getElementSelector('slugs')));

    // Slugs to nest are defined manually
    if (nestTarget && slugsElement) {
      const slugs = extractCommaSeparatedValues(slugsElement.textContent);

      manualNestTargets.set(collectionId, { slugs, nestTarget });
      continue;
    }

    // Otherwise treat the first element as the nest target
    // and always fetch as external
    externalNestTargets.set(collectionId, nestTargets[0]);
  }

  return { manualNestTargets, externalNestTargets };
};
