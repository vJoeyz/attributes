import { getInstanceIndex } from '$utils/attributes';
import { getCollectionElements } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';

// Types
interface Params {
  listsSelector?: string;
  targetSelector?: string;
}

interface PopulateData {
  listElements: HTMLDivElement[];
  target: HTMLDivElement;
}

// Constants destructuring
const {
  element: { key: elementKey },
  lists: { key: listsKey },
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
    globalListsSelector = params.getAttribute(listsKey);
    globalTargetSelector = params.getAttribute(targetKey);
  } else if (params) {
    globalListsSelector = params.listsSelector;
    globalTargetSelector = params.targetSelector;
  }

  const lists = document.querySelectorAll(
    `${getSelector('element', 'list', { operator: 'prefixed' })}${
      globalListsSelector ? `, ${globalListsSelector}` : ''
    }`
  );

  // Collect the combine data
  let populateData: PopulateData[] = [];

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

    // Make sure the populate data exists
    const data = (populateData[instanceIndex || 0] ||= { listElements: [], target });

    if (collectionListElement !== data.target) data.listElements.push(collectionListElement);
  }

  // Filter out invalid instances
  populateData = populateData.filter((data) => data && data.listElements.length);

  // Combine the lists
  for (const { listElements, target } of populateData) {
    for (const listElement of listElements) {
      const collectionItems = getCollectionElements(listElement, 'items');

      for (const item of collectionItems) target.appendChild(item);

      const collectionWrapper = getCollectionElements(listElement, 'wrapper');
      collectionWrapper?.remove();
    }
  }
};
