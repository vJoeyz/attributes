import debounce from 'just-debounce';
import { ANIMATIONS } from 'packages/cms/animations';
import { MATCHES, MODES } from './constants';
import { assessFilter } from './filter';
import { handleFilterInput } from './input';
import { clearFormField, isFormField } from '@finsweet/ts-utils';
import { collectFiltersData, collectFiltersElements, collectItemsProps } from './collect';

import type { FormBlockElement, FormField } from '@finsweet/ts-utils';
import type { CMSItem, CMSList } from 'packages/cms/CMSList';
import { setQueryParams } from './query';

// Types
type FilterMatch = typeof MATCHES[number];
type FilterMode = typeof MODES[number];

export interface FilterData {
  filterKeys: string[];
  match?: FilterMatch;
  mode?: FilterMode;
  fixedValue?: string | null;
}

export type FiltersData = Map<FormField, FilterData>;

export type GrouppedFilterKeys = string[][];

export interface FilterProperties {
  match?: FilterMatch;
  mode?: FilterMode;
  type?: string;
}

export type FilterValue = {
  values: Set<string | undefined>;
} & FilterProperties;

export type FiltersValues = Map<string, FilterValue>;

export type ResetButtonsData = Map<HTMLElement, string | null>;

export class CMSFilters {
  public readonly form;
  public readonly emptyElement;
  public readonly resultsElement;
  public readonly resetButtonsData;
  public readonly submitButton;

  public readonly filtersData;
  public readonly grouppedFilterKeys;
  public readonly filtersValues: FiltersValues = new Map();

  public readonly showQueryParams;

  private emptyState = false;
  private filtersActive = false;
  private resultsCount = 0;

  constructor(
    public readonly formBlock: FormBlockElement,
    public readonly listInstance: CMSList,
    {
      emptyElement,
      resultsElement,
      showQueryParams,
    }: { emptyElement: HTMLElement | null; resultsElement: HTMLElement | null; showQueryParams: boolean }
  ) {
    const { form, submitButton, resetButtonsData } = collectFiltersElements(formBlock);
    this.form = form;
    this.submitButton = submitButton;
    this.resetButtonsData = resetButtonsData;

    this.emptyElement = emptyElement;
    this.resultsElement = resultsElement;

    this.showQueryParams = showQueryParams;

    this.resultsCount = listInstance.items.filter(({ visible }) => visible).length;
    console.log(this.resultsCount);
    this.updateResults();

    const [filtersData, grouppedFilterKeys] = collectFiltersData(form);
    this.filtersData = filtersData;
    this.grouppedFilterKeys = grouppedFilterKeys;

    collectItemsProps(listInstance.items);

    this.listenEvents();
  }

  /**
   * Listens for internal events.
   */
  private listenEvents() {
    const { form, resetButtonsData: resetButtons, listInstance } = this;

    form.addEventListener('submit', (e) => this.handleSubmit(e));
    form.addEventListener(
      'input',
      debounce((e: Event) => this.handleInputEvents(e), 50)
    );

    for (const [resetButton, filterKey] of resetButtons) {
      resetButton?.addEventListener('click', () => this.resetFilters(filterKey));
    }

    const handleItems = (items: CMSItem[]) => {
      collectItemsProps(items);
      this.applyFilters(items, false);
    };

    listInstance.on('additems', (newItems) => {
      handleItems(newItems);

      this.resultsCount += newItems.length;
      this.updateResults();
    });

    listInstance.on('nestitems', handleItems);
  }

  /**
   * Updates the displayed results on the `resultsElement`.
   */
  private updateResults() {
    const { resultsElement, resultsCount } = this;

    if (resultsElement) resultsElement.textContent = `${resultsCount}`;
  }

  /**
   * Handles input events.
   * @param e The `InputEvent`.
   */
  private async handleInputEvents({ target }: Event) {
    const { filtersData, filtersValues, submitButton, showQueryParams } = this;

    if (!isFormField(target)) return;

    const filterData = filtersData.get(target);
    if (!filterData) return;

    handleFilterInput(target, filtersValues, filterData);

    if (showQueryParams) setQueryParams(filtersValues);

    console.log({ filtersValues });

    if (!submitButton) await this.applyFilters();
  }

  /**
   * Handles form submit events.
   * @param e The `Submit` event.
   */
  private handleSubmit(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();

    this.applyFilters();
  }

  /**
   * Sets if the filters are currently active, and inversely enables/disables {@link CMSList.showNewItems}.
   * When there are active filters, we want to disable `showNewItems` because the {@link CMSFilters.applyFilters} should handle it.
   * @param value
   */
  private setFiltersActive(value: boolean) {
    this.filtersActive = value;
    this.listInstance.showNewItems = !value;
  }

  /**
   * Applies the active filters to the list.
   *
   * @param newItems Optional list of `CMSItem` instances. If passed, only those instances will be filtered.
   * Used when new items have been added with `cmsload`.
   *
   * @param animateList When set to `true`, the list will fade out and fade in during the filtering process.
   */
  public async applyFilters(newItems?: CMSItem[], animateList = true): Promise<void> {
    const { listInstance, filtersValues, grouppedFilterKeys, filtersActive, emptyElement, emptyState } = this;

    const filtersExist = !!filtersValues.size;

    if (!filtersExist && !filtersActive) return;

    this.setFiltersActive(filtersExist);

    const filters = [...filtersValues.entries()];
    const filtersAreEmpty = filters.every(([, { values }]) => !values.size);

    const { fade } = ANIMATIONS;
    const { wrapper, list } = listInstance;

    if (animateList) await fade.out(wrapper);

    // Show / hide the items based on their match
    const itemsToShow: CMSItem[] = [];
    const itemsToHide: CMSItem[] = [];

    for (const item of newItems || listInstance.items) {
      const show = filtersAreEmpty || assessFilter(item, filters, grouppedFilterKeys);

      (show ? itemsToShow : itemsToHide).push(item);
    }

    await listInstance.renderItems(itemsToHide, false, !animateList);
    await listInstance.renderItems(itemsToShow, true, !animateList);

    // Show / hide the `Empty State` element, if existing
    if (!newItems && emptyElement) {
      const { length } = itemsToShow;

      if (length && emptyState) {
        emptyElement.remove();
        wrapper.prepend(list);
        this.emptyState = false;
      } else if (!length && !emptyState) {
        list.remove();
        wrapper.prepend(emptyElement);
        this.emptyState = true;
      }
    }

    // Update the results
    if (!newItems) this.resultsCount = itemsToShow.length;
    this.updateResults();

    if (animateList) await fade.in(wrapper);
  }

  /**
   * Resets the active filters.
   * @param filterKey If passed, only this filter key will be resetted.
   */
  public resetFilters(filterKey?: string | null): void {
    const { filtersData, filtersValues, showQueryParams } = this;

    if (filterKey) {
      const formFieldsToClear = [...filtersData.entries()]
        .filter(([, data]) => data.filterKeys.includes(filterKey))
        .map(([formField]) => formField);

      for (const formField of formFieldsToClear) clearFormField(formField, ['input']);

      filtersValues.delete(filterKey);
    } else {
      for (const formField of filtersData.keys()) clearFormField(formField, ['input']);
      filtersValues.clear();
    }

    if (showQueryParams) setQueryParams(filtersValues);
    this.applyFilters();
  }
}
