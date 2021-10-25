import { getObjectKeys, isKeyOf, isNotEmpty, restartWebflow } from '@finsweet/ts-utils';
import { initDefaultMode, initInfiniteMode, initLoadAllMode } from './modes';
import { CMSList, createCMSListInstance } from 'packages/cms/CMSList';
import { getCollectionListWrappers } from 'packages/cms/helpers';
import { ATTRIBUTES, getSelector } from './constants';
import { importAnimations } from '$utils/import';

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
      importAnimations().then((animationsImport) => {
        if (!animationsImport) return;

        const { animations, easings } = animationsImport;

        const animationName = listInstance.getAttribute(animationKey);
        const animationFunctions = isKeyOf(animationName, getObjectKeys(animations))
          ? animations[animationName]
          : animations.fade;

        const animationDuration = listInstance.getAttribute(durationKey);
        const animationEasing = listInstance.getAttribute(easingKey);
        const animationStagger = listInstance.getAttribute(staggerKey);

        listInstance.itemsAnimation = {
          ...animationFunctions,
          options: {
            easing: isKeyOf(animationEasing, easings) ? animationEasing : undefined,
            duration: animationDuration ? parseFloat(animationDuration) : undefined,
            stagger: animationStagger ? parseFloat(animationStagger) : undefined,
          },
        };
      });

      // Get resetIx config
      const resetIx = listInstance.getAttribute(resetIxKey) === resetIxValues.true;

      if (resetIx) {
        listInstance.on('finishload', async () => {
          await restartWebflow();
        });
      }

      // Get mode config
      const mode = listInstance.getAttribute(modeKey);

      // Init mode
      if (mode === modeValues.loadAll) await initLoadAllMode(listInstance);
      else if (mode === modeValues.infinite) initInfiniteMode(listInstance);
      else initDefaultMode(listInstance);

      return listInstance;
    })
  );

  return listInstances;
};
