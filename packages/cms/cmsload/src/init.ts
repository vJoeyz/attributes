import { isKeyOf, isNotEmpty } from '@finsweet/ts-utils';
import { ANIMATIONS, EASINGS } from 'packages/cms/animations';
import { CMSList, createCMSListInstance } from 'packages/cms/CMSList';
import { getCollectionListWrappers } from 'packages/cms/helpers';
import { ATTRIBUTES, getSelector } from './constants';
import { initDefaultMode, initInfiniteMode, initLoadAllMode } from './modes';

// Types
interface Params {
  listsSelector?: string;
  loadAll?: boolean;
}

// Constants
const {
  lists: { key: listsKey },
  mode: { key: modeKey, values: modeValues },
  animation: { key: animationKey },
  duration: { key: durationKey },
  easing: { key: easingKey },
  stagger: { key: staggerKey },
  resetIx: { key: resetIxKey, values: resetIxValues },
} = ATTRIBUTES;

/**
 * Inits the attribute.
 *
 * Auto init:
 * @param params The current `<script>` element.
 *
 * Programatic init:
 * @param params.param A global parameter.
 */
export const init = async (params?: HTMLOrSVGScriptElement | Params | null): Promise<CMSList[]> => {
  let globalListsSelector: string | null | undefined;

  if (params instanceof HTMLScriptElement || params instanceof SVGScriptElement) {
    globalListsSelector = params.getAttribute(listsKey);
  } else if (params) {
    globalListsSelector = params.listsSelector;
  }

  // Create the list instances
  const collectionListWrappers = getCollectionListWrappers([
    getSelector('element', 'list', { operator: 'prefixed' }),
    globalListsSelector,
  ]);

  const listInstances = collectionListWrappers.map(createCMSListInstance).filter(isNotEmpty);

  // Init the modes
  await Promise.all(
    listInstances.map(async (listInstance) => {
      // Get animation config
      const animationName = listInstance.getAttribute(animationKey);
      const animation = animationName ? ANIMATIONS[animationName] : ANIMATIONS.fade;

      const animationDuration = listInstance.getAttribute(durationKey);
      const animationEasing = listInstance.getAttribute(easingKey);
      const animationStagger = listInstance.getAttribute(staggerKey);

      const resetIx = listInstance.getAttribute(resetIxKey) === resetIxValues.true;

      listInstance.addAnimation({
        ...animation,
        options: {
          easing: isKeyOf(animationEasing, EASINGS) ? animationEasing : undefined,
          duration: animationDuration ? parseFloat(animationDuration) : undefined,
          stagger: animationStagger ? parseFloat(animationStagger) : undefined,
        },
        resetIx,
      });

      // Get mode config
      const mode = listInstance.getAttribute(modeKey);

      // Init mode
      if (mode === modeValues.loadAll) await initLoadAllMode(listInstance);
      else if (mode === modeValues.infinite) await initInfiniteMode(listInstance);
      else await initDefaultMode(listInstance);

      return listInstance;
    })
  );

  return listInstances;
};
