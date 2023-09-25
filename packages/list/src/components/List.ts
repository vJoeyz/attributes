import {
  type CollectionItemElement,
  type CollectionListElement,
  type CollectionListWrapperElement,
  getObjectEntries,
  isNumber,
  type PageCountElement,
  type PaginationButtonElement,
  type PaginationWrapperElement,
} from '@finsweet/attributes-utils';
import { atom, type WritableAtom } from 'nanostores';

import { getCollectionElements } from '../utils/dom';
import { getPaginationQuery } from '../utils/pagination';
import { subscribeMultiple } from '../utils/reactivity';
import { getInstanceIndex, queryElement } from '../utils/selectors';
import { listInstancesStore } from '../utils/store';
import { ListItem } from './ListItem';

type HookKey = 'filter' | 'sort' | 'paginate' | 'beforeRender' | 'render' | 'afterRender';
type HookCallback = (items: ListItem[]) => ListItem[] | Promise<ListItem[]> | void | Promise<void>;
type Hooks = {
  [key in HookKey]: {
    previous?: HookKey;
    callbacks: HookCallback[];
    result: WritableAtom<ListItem[] | undefined>;
  };
};

export class List {
  /**
   * Contains all lifecycle hooks with their callbacks and last result.
   */
  public readonly hooks: Hooks = {
    filter: {
      callbacks: [],
      result: atom(),
    },

    sort: {
      previous: 'filter',
      callbacks: [],
      result: atom(),
    },

    paginate: {
      previous: 'sort',
      callbacks: [],
      result: atom(),
    },

    beforeRender: {
      previous: 'paginate',
      callbacks: [],
      result: atom(),
    },

    render: {
      previous: 'beforeRender',
      callbacks: [],
      result: atom(),
    },

    afterRender: {
      previous: 'render',
      callbacks: [],
      result: atom(),
    },
  };

  /**
   * A signal holding all {@link ListItem} instances of the list.
   */
  public readonly items: WritableAtom<ListItem[]> = atom([]);

  /**
   * A set holding all rendered {@link ListItem} instances.
   */
  public renderedItems: Set<ListItem> = new Set();

  /**
   * The instance index.
   */
  public readonly instanceIndex?: number;

  /**
   * The `Collection List` element.
   */
  public readonly listElement?: CollectionListElement | null;

  /**
   * The `Pagination` wrapper element.
   */
  public readonly paginationWrapperElement?: PaginationWrapperElement | null;

  /**
   * The `Page Count` element.
   */
  public readonly paginationCountElement?: PageCountElement | null;

  /**
   * The `Previous` button.
   */
  public paginationPreviousElement?: PaginationButtonElement | null;

  /**
   * The `Next` button.
   */
  public paginationNextElement?: PaginationButtonElement | null;

  /**
   * A custom `Empty State` element.
   */
  public readonly emptyElement?: HTMLElement | null;

  /**
   * A custom loader element.
   */
  public readonly loaderElement?: HTMLElement | null;

  /**
   * An element that displays the total amount of items in the list.
   */
  public readonly itemsCountElement?: HTMLElement | null;

  /**
   * An element that displays the amount of visible items.
   */
  public readonly visibleCountElement?: HTMLElement | null;

  /**
   * An element that displays the lower range of visible items.
   */
  public readonly visibleCountFromElement?: HTMLElement | null;

  /**
   * An element that displays the upper range of visible items.
   */
  public readonly visibleCountToElement?: HTMLElement | null;

  /**
   * Defines the amount of items per page.
   */
  public readonly itemsPerPage: WritableAtom<number>;

  /**
   * Defines the total amount of pages in the list.
   */
  public readonly totalPages = atom(1);

  /**
   * Defines the current page in `Pagination` mode.
   */
  public readonly currentPage = atom<number | undefined>();

  /**
   * Defines if the pagination query param should be added to the URL when switching pages.
   * @example '?5f7457b3_page=1'
   */
  public readonly showPagesQuery = atom(false);

  /**
   * Defines the query key for the paginated pages.
   * @example '5f7457b3_page'
   */
  public pagesQuery?: string;

  /**
   * Defines an awaitable Promise that resolves once the pagination data (`currentPage` + `pagesQuery`) has been extracted.
   */
  public loadingPaginationData?: Promise<void>;

  /**
   * Defines if loaded CMS Items can be cached using IndexedDB after fetching them.
   */
  public cacheItems = true;

  constructor(public readonly wrapperElement: CollectionListWrapperElement, public readonly pageIndex: number) {
    // Collect elements
    const listElement = getCollectionElements(wrapperElement, 'list');
    this.listElement = listElement;

    const instanceIndex = getInstanceIndex(listElement || wrapperElement);
    this.instanceIndex = instanceIndex;

    this.paginationWrapperElement = getCollectionElements(wrapperElement, 'pagination-wrapper');
    this.paginationCountElement = getCollectionElements(wrapperElement, 'page-count');
    this.paginationNextElement = getCollectionElements(wrapperElement, 'pagination-next');
    this.paginationPreviousElement = getCollectionElements(wrapperElement, 'pagination-previous');
    this.emptyElement = getCollectionElements(wrapperElement, 'empty');
    this.loaderElement = queryElement('loader', { instanceIndex });
    this.itemsCountElement = queryElement('items-count', { instanceIndex });
    this.visibleCountElement = queryElement('visible-count', { instanceIndex });
    this.visibleCountFromElement = queryElement('visible-count-from', { instanceIndex });
    this.visibleCountToElement = queryElement('visible-count-to', { instanceIndex });

    // Collect items
    const collectionItemElements = getCollectionElements(wrapperElement, 'item');

    this.itemsPerPage = atom(collectionItemElements.length);

    if (listElement) {
      const items = collectionItemElements.map((element) => new ListItem(element, listElement));

      this.items.set(items);
      this.renderedItems = new Set(items);
    }

    // Extract pagination data
    this.loadingPaginationData = getPaginationQuery(this).then((paginationQuery) => {
      if (!paginationQuery) return;

      const [pagesQuery, targetPage] = paginationQuery;

      this.pagesQuery = pagesQuery;

      this.currentPage.set(paginationQuery ? targetPage : undefined);
    });

    // Add render hook
    this.addHook('render', (items) => {
      // TODO: animate

      items.forEach((item, index) => {
        const previousItem = items[index - 1];

        const render = () => {
          if (previousItem) {
            previousItem.element.after(item.element);
          } else {
            this.listElement?.prepend(item.element);
          }

          item.currentIndex = index;
        };

        // Is rendered
        if (isNumber(item.currentIndex)) {
          if (item.currentIndex !== index) {
            render();
          }

          this.renderedItems.delete(item);
        }

        // Is not rendered
        else {
          render();
        }
      });

      // Remove items that should not be rendered anymore
      this.renderedItems.forEach((renderedItem) => {
        renderedItem.element.remove();
        renderedItem.currentIndex = undefined;
      });

      this.renderedItems = new Set(items);

      return items;
    });

    // Start hooks chain
    for (const [key, { previous }] of getObjectEntries(this.hooks)) {
      const items = previous ? this.hooks[previous].result : this.items;

      items.listen(() => this.triggerHook(key));
    }

    // TODO: Move this into pagination mode
    // this.itemsPerPage.listen(() => this.triggerHook('paginate'));

    // Elements side effects
    // TODO: Refactor this
    this.items.subscribe((items) => {
      if (this.itemsCountElement) {
        this.itemsCountElement.textContent = `${items.length}`;
      }
    });

    subscribeMultiple([this.itemsPerPage, this.hooks.filter.result], ([itemsPerPage, filteredItems = []]) => {
      if (this.visibleCountElement) {
        const visibleCountTotal = Math.min(itemsPerPage, filteredItems.length);

        this.visibleCountElement.textContent = `${visibleCountTotal}`;
      }

      // TODO: Visible count from/to
    });
  }

  /**
   * Adds a hook.
   * @param key
   * @param callback
   */
  addHook(key: HookKey, callback: HookCallback) {
    const hook = this.hooks[key];

    hook.callbacks.push(callback);
  }

  /**
   * Triggers a hook.
   * @param key
   */
  async triggerHook(key: HookKey) {
    const hook = this.hooks[key];

    const { previous } = hook;

    const previousHookResult = previous ? this.hooks[previous].result : undefined;

    let result = previousHookResult?.get() || this.items.get();

    for (const callback of hook.callbacks) {
      result = (await callback(result)) || result;
    }

    hook.result.set(result);
  }

  /**
   * Stores new Collection Items in the instance.
   *
   * @param itemElements The new `Collection Item` elements to store.
   * @param method Defines the storing method:
   *
   * - `unshift`: New items are added to the beginning of the store.
   * - `push`: New items are added to the end of the store.
   *
   *  Defaults to `push`.
   */
  public addItems(itemElements: CollectionItemElement[], method: 'unshift' | 'push' = 'push') {
    const { items, listElement } = this;

    if (!listElement) return;

    const newItems = itemElements.map((item) => new ListItem(item, listElement));

    if (method === 'push') {
      items.set([...items.get(), ...newItems]);
    } else {
      items.set([...newItems, ...items.get()]);
    }
  }

  /**
   * Adds a missing `PaginationButtonElement` to the list.
   * @param element A {@link PaginationButtonElement}.
   * @param elementKey The button element key.
   * @param childIndex The button element key.
   */
  public addPaginationButton(
    element: PaginationButtonElement,
    elementKey: 'paginationNextElement' | 'paginationPreviousElement',
    childIndex: number
  ) {
    const { paginationWrapperElement } = this;

    if (!paginationWrapperElement || this[elementKey] || childIndex < 0) return;

    element.style.display = 'none';

    paginationWrapperElement.insertBefore(element, paginationWrapperElement.children[childIndex]);

    this[elementKey] = element;
  }

  /**
   * Destroys the instance.
   */
  public destroy() {
    // TODO: Call store.off() on all stores

    listInstancesStore.delete(this.wrapperElement);
  }

  /**
   * @returns The list element or wrapper element, whichever exists.
   */
  get listOrWrapper() {
    return this.listElement || this.wrapperElement;
  }
}
