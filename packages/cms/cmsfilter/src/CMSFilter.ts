import debounce from 'just-debounce';
import { assessFilter, clearFiltersData } from './filter';
import { getQueryParams, setQueryParams } from './query';
import { handleFilterInput } from './input';
import { ATTRIBUTES } from './constants';
import { isFormField } from '@finsweet/ts-utils';
import { collectFiltersData, collectFiltersElements } from './collect';

import type { FormBlockElement } from '@finsweet/ts-utils';
import type { CMSItem, CMSList } from 'packages/cms/cmscore/src';
import type { CMSCore } from 'packages/cms/cmscore/src/types';

// Constants
const {
  field: { key: fieldKey },
  range: { key: rangeKey },
  type: { key: typeKey },
} = ATTRIBUTES;

export class CMSFilters {
  public readonly form;
  public readonly emptyElement;
  public readonly resultsElement;
  public readonly resetButtonsData;
  public readonly submitButton;
  public readonly filtersData;

  public filtersActive = false;
  public resultsCount = 0;

  private readonly showQueryParams;
  private readonly scrollTop;

  private emptyState = false;

  constructor(
    public readonly formBlock: FormBlockElement,
    public readonly listInstance: CMSList,
    private readonly cmsCore: CMSCore,
    {
      emptyElement,
      resultsElement,
      showQueryParams,
      scrollTop,
    }: {
      emptyElement: HTMLElement | null;
      resultsElement: HTMLElement | null;
      showQueryParams: boolean;
      scrollTop: boolean;
    }
  ) {
    const { form, submitButton, resetButtonsData } = collectFiltersElements(formBlock);
    this.form = form;
    this.submitButton = submitButton;
    this.resetButtonsData = resetButtonsData;

    this.emptyElement = emptyElement;
    this.resultsElement = resultsElement;

    this.showQueryParams = showQueryParams;
    this.scrollTop = scrollTop;

    this.filtersData = collectFiltersData(form);

    this.init();
  }

  /**
   * Inits the instance.
   */
  private async init() {
    const {
      cmsCore: { collectItemsProps },
      listInstance: { items },
    } = this;

    collectItemsProps(items, { fieldKey, rangeKey, typeKey });

    this.resultsCount = items.filter(({ visible }) => visible).length;
    this.updateResults();

    const queryParamsValid = getQueryParams(this);

    if (queryParamsValid) this.applyFilters();

    this.listenEvents();
  }

  /**
   * Listens for internal events.
   */
  private async listenEvents() {
    const { form, resetButtonsData } = this;

    // Form
    form.addEventListener('submit', (e) => this.handleSubmit(e));
    form.addEventListener(
      'input',
      debounce((e: Event) => this.handleInputEvents(e), 50)
    );

    // Reset buttons
    for (const [resetButton, filterKey] of resetButtonsData) {
      resetButton?.addEventListener('click', () => this.resetFilters(filterKey));
    }
  }

  /**
   * Updates the displayed results on the `resultsElement`.
   */
  public updateResults() {
    const { resultsElement, resultsCount } = this;

    if (resultsElement) resultsElement.textContent = `${resultsCount}`;
  }

  /**
   * Handles input events.
   * @param e The `InputEvent`.
   */
  private async handleInputEvents({ target }: Event) {
    const { filtersData, submitButton, showQueryParams } = this;

    if (!isFormField(target)) return;

    handleFilterInput(target, filtersData);

    if (showQueryParams) setQueryParams(filtersData);

    if (!submitButton) await this.applyFilters();
  }

  /**
   * Handles form submit events.
   * @param e The `Submit` event.
   */
  private async handleSubmit(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();

    await this.applyFilters();
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
    const { listInstance, filtersData, filtersActive, emptyElement, emptyState, scrollTop } = this;

    const filtersAreEmpty = filtersData.every(({ values }) => !values.size);

    if (filtersAreEmpty && !filtersActive) return;

    this.setFiltersActive(!filtersAreEmpty);

    const { wrapper, list } = listInstance;

    // Scroll Top
    if (scrollTop) this.scrollToTop();

    // Start populating
    if (animateList) await listInstance.displayList(false);

    // Show / hide the items based on their match
    const itemsToShow: CMSItem[] = [];
    const itemsToHide: CMSItem[] = [];

    for (const item of newItems || listInstance.items) {
      const show = filtersAreEmpty || assessFilter(item, filtersData);

      (show ? itemsToShow : itemsToHide).push(item);
    }

    // Handle `Empty State`
    if (emptyElement) {
      const { length } = itemsToShow;

      // Hide the state when items are shown
      if (length && emptyState) {
        emptyElement.remove();
        wrapper.prepend(list);

        this.emptyState = false;
      }
      // Only show it when no new items are being added
      else if (!newItems && !length && !emptyState) {
        list.remove();
        wrapper.prepend(emptyElement);

        this.emptyState = true;
      }
    }

    // Render the items
    await listInstance.renderItems(itemsToHide, false, !animateList);
    await listInstance.renderItems(itemsToShow, true, !animateList);

    // Update the results
    if (newItems) this.resultsCount += itemsToShow.length;
    else this.resultsCount = itemsToShow.length;
    this.updateResults();

    if (animateList) await listInstance.displayList();

    // Scroll Top
    if (scrollTop) this.scrollToTop();
  }

  /**
   * Resets the active filters.
   * @param filterKey If passed, only this filter key will be resetted.
   */
  public async resetFilters(filterKey?: string | null): Promise<void> {
    const { filtersData, showQueryParams } = this;

    if (!filterKey) clearFiltersData(filtersData);
    else {
      const filtersToReset = filtersData.filter(({ filterKeys }) => filterKeys.has(filterKey));

      clearFiltersData(filtersToReset);
    }

    if (showQueryParams) setQueryParams(filtersData);

    await this.applyFilters();
  }

  /**
   * Scrolls to the top of the list.
   */
  public scrollToTop() {
    this.listInstance.wrapper.parentElement?.scrollIntoView({ behavior: 'smooth' });
  }
}
