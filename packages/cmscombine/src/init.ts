import { getInstanceIndex } from '$utils/attributes';
import { getCollectionElements } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';

// Types
interface Params {
  selector?: string;
  target?: string;
}

// Constants destructuring
const {
  element: { key: elementKey },
  selector: { key: selectorKey },
  target: { key: targetKey },
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
export const init = (params?: HTMLOrSVGScriptElement | Params | null): void => {
  let globalListsSelector: string | null | undefined;
  let globalTargetSelector: string | null | undefined;

  if (params instanceof HTMLScriptElement || params instanceof SVGScriptElement) {
    globalListsSelector = params.getAttribute(selectorKey);
    globalTargetSelector = params.getAttribute(targetKey);
  } else if (params) {
    globalListsSelector = params.selector;
    globalTargetSelector = params.target;
  }

  const lists = document.querySelectorAll(
    `${getSelector('element', 'list', { operator: 'prefixed' })}${
      globalListsSelector ? `, ${globalListsSelector}` : ''
    }`
  );

  // Collect the combine data
  const combineData: Array<{ listElements: Element[]; target: Element }> = [];

  for (const list of lists) {
    const collectionListElement = getCollectionElements(list, 'list');
    if (!collectionListElement) continue;

    const instanceIndex = getInstanceIndex(list, elementKey);

    // Get the target, default to the first list when non-existing
    const target =
      getCollectionElements(
        `${getSelector('element', 'target', { instanceIndex })}${
          globalTargetSelector ? `, ${globalTargetSelector}` : ''
        }`,
        'list'
      ) || collectionListElement;

    // Make sure the combine data exists
    combineData[instanceIndex || 0] ||= { listElements: [], target };

    // Collect the list
    const data = combineData[instanceIndex || 0];

    if (collectionListElement !== data.target) data.listElements.push(collectionListElement);
  }

  // Combine the valid lists
  for (const { listElements, target } of combineData.filter((data) => data && data.listElements.length)) {
    for (const listElement of listElements) {
      const collectionItems = getCollectionElements(listElement, 'items');

      for (const item of collectionItems) target.appendChild(item);

      const collectionWrapper = getCollectionElements(listElement, 'wrapper');
      collectionWrapper?.remove();
    }
  }
};
