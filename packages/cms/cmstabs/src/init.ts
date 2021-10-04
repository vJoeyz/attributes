import { getInstanceIndex } from '$utils/attributes';
import { getCollectionElements, restartWebflow, TABS_CSS_CLASSES, CURRENT_CSS_CLASS } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';

import type {
  TabsElement,
  TabsMenuElement,
  TabsContentElement,
  TabLinkElement,
  TabPaneElement,
  CollectionListElement,
} from '@finsweet/ts-utils';

// Types
interface Params {
  listsSelector?: string;
  targetSelector?: string;
}

interface PopulateData {
  listElements: CollectionListElement[];
  tabsElement: TabsElement;
}

// Constants destructuring
const {
  element: { key: elementKey },
  lists: { key: selectorKey },
  target: { key: targetKey },
} = ATTRIBUTES;

const {
  tabs: tabsCSSClass,
  tabsContent: tabsContentCSSClass,
  tabPane: tabPaneCSSClass,
  tabsMenu: tabsMenuCSSClass,
  tabLink: tabLinkCSSClass,
  activeTab: activeTabCSSClass,
} = TABS_CSS_CLASSES;

/**
 * Inits the attribute.
 *
 * Auto init:
 * @param params The current `<script>` element.
 *
 * Programatic init:
 * @param params.param A global parameter.
 */
export const init = async (params?: HTMLOrSVGScriptElement | Params | null): Promise<void> => {
  let globalListsSelector: string | null | undefined;
  let globalTargetSelector: string | null | undefined;

  if (params instanceof HTMLScriptElement || params instanceof SVGScriptElement) {
    globalListsSelector = params.getAttribute(selectorKey);
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

    // Get the slider target
    const tabsElement = document.querySelector<TabsElement>(
      `.${tabsCSSClass}${getSelector('element', 'tabs', { instanceIndex })}${
        globalTargetSelector ? `, .${tabsCSSClass}${globalTargetSelector}` : ''
      }`
    );

    if (!tabsElement) continue;

    // Make sure the populate data exists
    const data = (populateData[instanceIndex || 0] ||= { listElements: [], tabsElement });

    // Collect the list
    data.listElements.push(collectionListElement);
  }

  // Filter out invalid instances
  populateData = populateData.filter((data) => data && data.listElements.length);

  // Populate the sliders
  for (const data of populateData) populateTabsFromLists(data);

  await restartWebflow();
};

/**
 * Creates a new `Slide` inside the Slider for each `Collection Item` of the lists.
 * @param populateData
 */
const populateTabsFromLists = ({ listElements, tabsElement }: PopulateData) => {
  const tabsMenu = tabsElement.querySelector<TabsMenuElement>(`.${tabsMenuCSSClass}`);
  const tabsContent = tabsElement.querySelector<TabsContentElement>(`.${tabsContentCSSClass}`);
  const existingTabLinks = tabsElement.querySelectorAll<TabLinkElement>(`.${tabLinkCSSClass}`);
  const existingTabPanes = tabsElement.querySelectorAll<TabPaneElement>(`.${tabPaneCSSClass}`);
  if (!tabsMenu || !tabsContent || !existingTabLinks.length || !existingTabPanes.length) return;

  // Store the template CSS classes
  const tabLinkCSS = existingTabLinks[0].classList.value;
  const tabPaneCSS = existingTabPanes[0].classList.value;

  // Remove existing items
  for (const element of [...existingTabLinks, ...existingTabPanes]) element.remove();

  let itemIndex = 0;

  for (const listElement of listElements) {
    const collectionItems = getCollectionElements(listElement, 'items');

    // Add a new `Tab Link` and `Tab Pane` for each `Collection Item`
    for (const collectionItem of collectionItems) {
      const newTabLink = document.createElement('div');
      newTabLink.setAttribute('class', tabLinkCSS);

      const newTabPane = document.createElement('div');
      newTabPane.setAttribute('class', tabPaneCSS);

      for (const element of [newTabLink, newTabPane]) element.dataset.wTab = `Tab ${itemIndex}`;

      if (itemIndex === 0) {
        newTabLink.classList.add(CURRENT_CSS_CLASS);
        newTabPane.classList.add(activeTabCSSClass);
      }

      // Populate the `Tab Link` and `Tab Pane`
      let newTabLinkContent = collectionItem.querySelector(getSelector('element', 'tabLink', { operator: 'prefixed' }));
      if (!newTabLinkContent) {
        newTabLinkContent = document.createElement('div');
        newTabLinkContent.innerHTML = /* html */ `Use <strong>${getSelector(
          'element',
          'tabLink'
        )}</strong> to define this Tab Link content.`;
      }

      newTabLink.appendChild(newTabLinkContent);
      newTabPane.appendChild(collectionItem);

      // Populate the `Tabs` component
      tabsMenu.appendChild(newTabLink);
      tabsContent.appendChild(newTabPane);

      // Increment item index
      itemIndex += 1;
    }

    // Remove the Collection List Wrapper
    const collectionWrapper = getCollectionElements(listElement, 'wrapper');
    collectionWrapper?.remove();
  }
};
