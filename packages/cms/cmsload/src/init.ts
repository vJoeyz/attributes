import { getCollectionElements, isKeyOf } from '@finsweet/ts-utils';
import { ANIMATIONS, EASINGS } from 'packages/cms/animations';
import { CMSList } from 'packages/cms/CMSList';
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

  // Get the Collection Lists
  const lists = [
    ...document.querySelectorAll<HTMLElement>(
      `${getSelector('element', 'list', { operator: 'prefixed' })}${
        globalListsSelector ? `, ${globalListsSelector}` : ''
      }`
    ),
  ];

  // Get the Wrappers and make sure that non are duplicated
  const collectionListWrappers = lists.reduce<HTMLElement[]>((wrappers, referenceElement) => {
    if (!referenceElement) return wrappers;

    const collectionListWrapper = getCollectionElements(referenceElement, 'wrapper');
    if (!collectionListWrapper || wrappers.includes(collectionListWrapper)) return wrappers;

    wrappers.push(collectionListWrapper);

    return wrappers;
  }, []);

  // Create the list instances and init the modes
  const listInstances = await Promise.all(
    collectionListWrappers.map(async (collectionListWrapper) => {
      const listInstance = new CMSList(collectionListWrapper, ANIMATIONS.fade);

      const animationName = listInstance.getAttribute(animationKey);
      const animation = animationName ? ANIMATIONS[animationName] : undefined;

      if (animation) {
        const animationDuration = listInstance.getAttribute(durationKey);
        const animationEasing = listInstance.getAttribute(easingKey);

        listInstance.addAnimation({
          ...animation,
          options: {
            duration: animationDuration ? parseInt(animationDuration) : undefined,
            easing: isKeyOf(animationEasing, EASINGS) ? animationEasing : undefined,
          },
        });
      }

      const mode = listInstance.getAttribute(modeKey);

      if (mode === modeValues.loadAll) initLoadAllMode(listInstance);
      else if (mode === modeValues.infinite) initInfiniteMode(listInstance);
      else initDefaultMode(listInstance);

      return listInstance;
    })
  );

  return listInstances;
};
