import { type CollectionItemElement, extractCommaSeparatedValues } from '@finsweet/ts-utils';

import { normalizePropKey } from '$global/helpers';
import type { CMSCore } from '$packages/cmscore';

import { ATTRIBUTES, getAttribute, getSelector } from '../utils/constants';
import type { NestSources, ExternalNestTargets, ManualNestTargets } from '../utils/types';

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
  const manualNestTargets: ManualNestTargets = new Map();
  const externalNestTargets: ExternalNestTargets = new Map();

  const nestTargetElements = itemElement.querySelectorAll<HTMLElement>(`${getSelector('collection')}:not(a)`);

  for (const nestTarget of nestTargetElements) {
    const collectionId = normalizePropKey(getAttribute(nestTarget, 'collection'));
    if (!collectionId) continue;

    const slugs = extractCommaSeparatedValues(nestTarget.textContent);

    // Slugs to nest are defined manually
    if (slugs.length) {
      manualNestTargets.set(collectionId, { slugs, nestTarget });
    }

    // Or have to be fetched
    else {
      externalNestTargets.set(collectionId, nestTarget);
    }
  }

  return { manualNestTargets, externalNestTargets };
};
