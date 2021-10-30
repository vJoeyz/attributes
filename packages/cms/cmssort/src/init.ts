import { isKeyOf } from '@finsweet/ts-utils';
import { importAnimations, importCMSCore } from '$utils/import';
import { initHTMLSelect } from './select';
import { initButtons } from './buttons';
import {
  ATTRIBUTES,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_ASC_CLASS,
  DEFAULT_DESC_CLASS,
  getSelector,
} from './constants';

import type { CSSClasses } from './types';
import type { CMSList } from '$cms/cmscore/src';

// Constants destructuring
const {
  element: { key: elementKey },
  field: { key: fieldKey },
  type: { key: typeKey },
  duration: { key: durationKey },
  easing: { key: easingKey },
  ascClass: { key: ascClassKey },
  descClass: { key: descClassKey },
} = ATTRIBUTES;

/**
 * Inits the attribute.
 */
export const init = async (): Promise<void> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return;

  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  await Promise.all(listInstances.map(initList));
};

const initList = async (listInstance: CMSList) => {
  const instanceIndex = listInstance.getInstanceIndex(elementKey);

  const triggers = document.querySelectorAll<HTMLElement>(getSelector('element', 'trigger', { instanceIndex }));
  if (!triggers.length) return;

  const { items, listAnimation } = listInstance;

  // Store item props
  for (const item of items) item.collectProps({ fieldKey, typeKey });

  // Animation
  if (!listAnimation) {
    importAnimations().then((animationsImport) => {
      if (!animationsImport) return;

      const {
        animations: { fade },
        easings,
      } = animationsImport;

      const animationDuration = listInstance.getAttribute(durationKey);
      const animationEasing = listInstance.getAttribute(easingKey);

      listInstance.listAnimation = {
        ...fade,
        options: {
          easing: isKeyOf(animationEasing, easings) ? animationEasing : undefined,
          duration: animationDuration ? parseFloat(animationDuration) / 200 : DEFAULT_ANIMATION_DURATION,
        },
      };
    });
  }

  // CSS Classes
  const cssClasses: CSSClasses = {
    asc: listInstance.getAttribute(ascClassKey) || DEFAULT_ASC_CLASS,
    desc: listInstance.getAttribute(descClassKey) || DEFAULT_DESC_CLASS,
  };

  // Init mode
  const [firstTrigger] = triggers;

  const originalItemsOrder = [...items];

  const sortItems =
    firstTrigger instanceof HTMLSelectElement
      ? initHTMLSelect(firstTrigger, listInstance, originalItemsOrder)
      : initButtons(triggers, listInstance, cssClasses);

  listInstance.on('shouldcollectprops', async (newItems) => {
    for (const item of newItems) item.collectProps({ fieldKey, typeKey });
  });

  listInstance.on('shouldsort', async (newItems) => {
    originalItemsOrder.push(...newItems);

    await sortItems(true);
  });
};
