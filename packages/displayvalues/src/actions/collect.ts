import type { FormField } from '@finsweet/ts-utils';

import { getInstanceIndex, queryAllElements } from '../utils/selectors';
import { relationshipsStore } from '../utils/stores';

/**
 * Collects the targets where to display the values.
 * @param sourceElement
 */
export const collectTargets = (sourceElement: FormField) => {
  const instanceIndex = getInstanceIndex(sourceElement);

  const displayTargets = queryAllElements('target', { instanceIndex });
  if (!displayTargets.length) return;

  relationshipsStore.set(sourceElement, displayTargets);
};
