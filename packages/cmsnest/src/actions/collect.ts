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
    // If there's only 1 target, always fetch the item template page
    if (nestTargets.length === 1) {
      externalNestTargets.set(collectionId, nestTargets[0]);
      continue;
    }

    // If there are multiple targets, check if the slugs are defined manually
    const slugsElement = nestTargets.find(({ textContent }) => textContent?.trim().length) || nestTargets[0];
    const nestTarget =
      nestTargets.find((nestTarget) => nestTarget !== slugsElement) || nestTargets[nestTargets.length - 1];

    const slugs = extractCommaSeparatedValues(slugsElement.textContent);

    // Slugs to nest are defined manually
    manualNestTargets.set(collectionId, { slugs, nestTarget });
  }

  return { manualNestTargets, externalNestTargets };
};
