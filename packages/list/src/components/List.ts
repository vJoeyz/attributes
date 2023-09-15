import {
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
import { getInstanceIndex } from '../utils/selectors';
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
   * A signal holding all rendered {@link ListItem} instances.
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
  public emptyElement?: HTMLElement | null;

  /**
   * Defines the amount of items per page.
   */
  public readonly itemsPerPage: WritableAtom<number>;

  /**
   * Defines the total amount of pages in the list.
   */
  public readonly totalPages = atom(1);

  constructor(public readonly wrapperElement: CollectionListWrapperElement, public readonly pageIndex: number) {
    // Collect elements
    const listElement = getCollectionElements(wrapperElement, 'list');

    this.listElement = listElement;

    this.paginationWrapperElement = getCollectionElements(wrapperElement, 'pagination-wrapper');
    this.paginationCountElement = getCollectionElements(wrapperElement, 'page-count');
    this.paginationNextElement = getCollectionElements(wrapperElement, 'pagination-next');
    this.paginationPreviousElement = getCollectionElements(wrapperElement, 'pagination-previous');
    this.emptyElement = getCollectionElements(wrapperElement, 'empty');

    // Collect instance index
    this.instanceIndex = getInstanceIndex(listElement || wrapperElement);

    // Collect items
    const collectionItemElements = getCollectionElements(wrapperElement, 'item');

    this.itemsPerPage = atom(collectionItemElements.length);

    if (listElement) {
      const items = collectionItemElements.map((element) => new ListItem(element, listElement));

      this.items.set(items);
      this.renderedItems = new Set(items);
    }

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

    this.itemsPerPage.listen(() => this.triggerHook('paginate'));
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
   * Destroys the instance.
   */
  public destroy() {
    // TODO: Call store.off() on all stores

    listInstancesStore.delete(this.wrapperElement);
  }
}
