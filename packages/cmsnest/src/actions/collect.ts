import { type CollectionItemElement, extractCommaSeparatedValues } from '@finsweet/ts-utils';

import { normalizePropKey } from '$global/helpers';
import type { CMSCore } from '$packages/cmscore';

import { ATTRIBUTES, getAttribute, getSelector } from '../utils/constants';
import type { ExternalNestTargets, ManualNestTargets, NestSources } from '../utils/types';

/**
 * Queries the existing CMS Collections on the page that will be nested inside the main list instance.
 * @returns A `Map` with the `collectionKey` as the keys and `CMSList` instances as the values.
 */
export const getNestSources = ({ createCMSListInstances }: CMSCore): NestSources => {
  const nestSources: NestSources = new Map();

  const listInstances = createCMSListInstances([getSelector('collection')]);

  for (const listInstance of listInstances) {
    const collectionId = normalizePropKey(listInstance.getAttribute(ATTRIBUTES.collection.key));
    if (!collectionId) continue;

    const emptyElement = document.querySelector<HTMLElement>(`[${ATTRIBUTES.empty.key}^="${collectionId}"]`);
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
  const nestTargetElements = itemElement.querySelectorAll<HTMLElement>(`${getSelector('collection')}:not(a)`);

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
    const nestTarget = nestTargets.find((nestTarget) => nestTarget.matches(getSelector('element', 'nestTarget')));
    const slugsElement = nestTargets.find((nestTarget) => nestTarget.matches(getSelector('element', 'slugs')));

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
