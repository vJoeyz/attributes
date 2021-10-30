import debounce from 'just-debounce';
import { assessFilter, clearFiltersData } from './filter';
import { getQueryParams, setQueryParams } from './query';
import { handleFilterInput } from './input';
import { ATTRIBUTES } from './constants';
import { isFormField } from '@finsweet/ts-utils';
import { collectFiltersData, collectFiltersElements } from './collect';

import type { FormBlockElement } from '@finsweet/ts-utils';
import type { CMSList } from '$cms/cmscore/src';
import type { CMSCore } from '$cms/cmscore/src/types';

// Constants
const {
  field: { key: fieldKey },
  range: { key: rangeKey },
  type: { key: typeKey },
} = ATTRIBUTES;

/**
 * Instance of a `cmsfilter` form that contains all the filter inputs.
 */
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

    this.updateResults(items.length);

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
  public updateResults(resultsCount: number) {
    const { resultsElement } = this;

    if (resultsElement) resultsElement.textContent = `${resultsCount}`;

    this.resultsCount = resultsCount;
  }

  /**
   * Handles input events.
   * @param e The `InputEvent`.
   */
  private async handleInputEvents({ target }: Event) {
    const { filtersData, submitButton, showQueryParams } = this;

    if (!isFormField(target)) return;

    const validInput = handleFilterInput(target, filtersData);
    if (!validInput) return;

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
   * Mutates each `CMSItem`'s state to define if it should be displayed or not.
   *
   * @param addingItems Defines if new items are being added.
   * In that case, the rendering responsibilities are handled by another controller.
   */
  public async applyFilters(addingItems?: boolean): Promise<void> {
    const { listInstance, filtersData, filtersActive, emptyElement, emptyState, scrollTop } = this;
    const { wrapper, list, items } = listInstance;

    // Abort if no filtering is needed
    const filtersAreEmpty = filtersData.every(({ values }) => !values.size);

    if (filtersAreEmpty && !filtersActive) {
      this.updateResults(items.length);
      return;
    }

    this.filtersActive = !filtersAreEmpty;

    // Define show/hide of each item based on the match
    const itemsToShowCount = items.reduce((itemsToShow, item) => {
      const show = filtersAreEmpty || assessFilter(item, filtersData);

      if (show) itemsToShow += 1;

      item.mustShow = show;

      return itemsToShow;
    }, 0);

    // Handle `Empty State`
    if (emptyElement) {
      // Hide the state when items are shown
      if (itemsToShowCount && emptyState) {
        emptyElement.remove();
        wrapper.prepend(list);

        this.emptyState = false;
      }
      // Only show it when no new items are being added
      else if (!itemsToShowCount && !emptyState) {
        list.remove();
        wrapper.prepend(emptyElement);

        this.emptyState = true;
      }
    }

    // Render the items
    if (!addingItems) {
      await listInstance.renderItems();

      if (scrollTop) this.scrollToTop();
    }

    // Update the results
    this.updateResults(itemsToShowCount);
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
