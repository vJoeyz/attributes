import debounce from 'just-debounce';
import { assessFilter, clearFilterData } from './filter';
import { getQueryParams, setQueryParams } from './query';
import { handleFilterInput } from './input';
import { ATTRIBUTES } from './constants';
import { isFormField, sameValues } from '@finsweet/ts-utils';
import { collectFiltersData, collectFiltersElements } from './collect';
import { syncFilterKeyResults, updateFilterKeyResults, updateListResults } from './results';
import { displayFilterElements } from './display';

import type { FormBlockElement } from '@finsweet/ts-utils';
import type { CMSList } from '$cms/cmscore/src';
import type { CMSTags } from './CMSTags';

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
  /**
   * The <form> element that holds all filters.
   */
  public readonly form;

  /**
   * An element where the amount of matching results is displayed.
   */
  public readonly resultsElement;

  /**
   * Reset buttons settings.
   */
  public readonly resetButtonsData;

  /**
   * A `<input type="submit">` button.
   */
  public readonly submitButton;

  /**
   * The filters data.
   */
  public readonly filtersData;

  /**
   * Defines if any filter element that must be hidden when empty exists.
   */
  public readonly hideEmptyFilters;

  /**
   * Defines if the filters query must be printed in the Address bar.
   */
  private readonly showQueryParams;

  /**
   * Defines if any filter element has a results display element.
   */
  public readonly showFilterResults;

  /**
   * Defines if any filter element must highlight its matching results.
   */
  public readonly highlightResults;

  /**
   * The CSS class used to highlight elements in the results.
   */
  public readonly highlightCSSClass;

  /**
   * Defines if any filter is currently active.
   */
  private filtersActive = false;

  /**
   * Defines a {@link CMSTags} instance.
   */
  private tagsInstance?: CMSTags;

  constructor(
    /**
     * Defines the `Form Block` element that hold all filters.
     */
    public readonly formBlock: FormBlockElement,

    /**
     * Defines a {@link CMSList} instance.
     */
    public readonly listInstance: CMSList,
    {
      resultsElement,
      showQueryParams,
      highlightAll,
      highlightCSSClass,
    }: {
      resultsElement: HTMLElement | null;
      showQueryParams: boolean;
      highlightAll: boolean;
      highlightCSSClass: string;
    }
  ) {
    const { form, submitButton, resetButtonsData } = collectFiltersElements(formBlock);
    this.form = form;
    this.submitButton = submitButton;
    this.resetButtonsData = resetButtonsData;

    this.resultsElement = resultsElement;

    this.showQueryParams = showQueryParams;

    const filtersData = collectFiltersData(form, highlightAll);

    this.filtersData = filtersData;

    this.showFilterResults = filtersData.some(({ elements }) => elements.some(({ resultsElement }) => resultsElement));

    this.hideEmptyFilters = filtersData.some(({ elements }) => elements.some(({ hideEmpty }) => hideEmpty));

    this.highlightResults = filtersData.some(({ highlight }) => highlight);
    this.highlightCSSClass = highlightCSSClass;

    this.init();
  }

  /**
   * Inits the instance.
   */
  private async init() {
    const { listInstance, hideEmptyFilters, showFilterResults } = this;

    for (const item of listInstance.items) item.collectProps({ fieldKey, rangeKey, typeKey });

    updateListResults(this, listInstance);

    syncFilterKeyResults(this, listInstance);

    if (hideEmptyFilters) displayFilterElements(this);

    if (showFilterResults) updateFilterKeyResults(this);

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
    for (const [resetButton, filterKeys] of resetButtonsData) {
      resetButton?.addEventListener('click', () => this.resetFilters(filterKeys));
    }
  }

  /**
   * Handles input events.
   * @param e The `InputEvent`.
   */
  private async handleInputEvents({ target }: Event) {
    const { filtersData, submitButton, showQueryParams, tagsInstance } = this;

    if (!isFormField(target)) return;

    const validInput = handleFilterInput(target, filtersData);
    if (!validInput) return;

    if (showQueryParams) setQueryParams(filtersData);

    if (tagsInstance) tagsInstance.syncTags(filtersData);

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
    const { listInstance, filtersData, filtersActive, highlightResults: highlightActivated } = this;
    const { items, currentPage } = listInstance;

    // Abort if no filtering is needed
    const filtersAreEmpty = filtersData.every(({ values }) => !values.size);

    if (filtersAreEmpty && !filtersActive) return;

    this.filtersActive = !filtersAreEmpty;

    // Define show/hide of each item based on the match
    for (const item of items) {
      item.valid = assessFilter(item, filtersData, filtersAreEmpty, highlightActivated);
    }

    // Render the items
    if (!addingItems) {
      if (currentPage) listInstance.currentPage = 1;

      await listInstance.renderItems();

      listInstance.scrollToAnchor();
    }
  }

  /**
   * Resets the active filters.
   * @param filterKey If passed, only this filter key will be resetted.
   * @param value If passed, only that specific value and the elements that hold it will be cleared.
   */
  public async resetFilters(filterKeys?: string[], value?: string): Promise<void> {
    const { filtersData, showQueryParams, tagsInstance } = this;

    if (!filterKeys || !filterKeys.length) for (const filterData of filtersData) clearFilterData(filterData);
    else {
      const filterData = filtersData.find((data) => sameValues(data.filterKeys, filterKeys));
      if (!filterData) return;

      clearFilterData(filterData, value);
    }

    await Promise.all([
      // Apply filters
      this.applyFilters(),

      // Sync the tags
      (async () => {
        if (!value && tagsInstance) await tagsInstance.syncTags(filtersData);
      })(),
    ]);

    if (showQueryParams) setQueryParams(filtersData);
  }

  /**
   * Adds a {@link CMSTags} instance.
   * @param tagsInstance The `CMSTags` instance.
   */
  public async addTagsInstance(tagsInstance: CMSTags) {
    const { filtersData } = this;

    this.tagsInstance = tagsInstance;

    await tagsInstance.syncTags(filtersData);
  }
}
