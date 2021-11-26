import debounce from 'just-debounce';
import { assessFilter, clearFilterData } from './filter';
import { getQueryParams, setQueryParams } from './query';
import { handleFilterInput } from './input';
import { ATTRIBUTES } from './constants';
import { isFormField, isVisible, sameValues } from '@finsweet/ts-utils';
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
   * The CSS class added to active checkboxes/radios' parents.
   */
  public readonly activeCSSClass;

  /**
   * The debouncing value used for input events.
   */
  private readonly debouncing;

  /**
   * Defines if any filter is currently active.
   */
  private filtersActive = false;

  /**
   * Defines if the submit button is visible.
   */
  private submitButtonVisible;

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
      activeCSSClass,
      debouncing,
    }: {
      resultsElement: HTMLElement | null;
      showQueryParams: boolean;
      highlightAll: boolean;
      highlightCSSClass: string;
      activeCSSClass: string;
      debouncing: number;
    }
  ) {
    const { form, submitButton, resetButtonsData } = collectFiltersElements(formBlock);

    this.submitButtonVisible = !!submitButton && isVisible(submitButton);

    const filtersData = collectFiltersData(form, activeCSSClass, highlightAll);

    this.filtersData = filtersData;

    this.showFilterResults = filtersData.some(({ elements }) => elements.some(({ resultsElement }) => resultsElement));

    this.hideEmptyFilters = filtersData.some(({ elements }) => elements.some(({ hideEmpty }) => hideEmpty));

    this.highlightResults = filtersData.some(({ highlight }) => highlight);

    this.form = form;
    this.submitButton = submitButton;
    this.resetButtonsData = resetButtonsData;
    this.highlightCSSClass = highlightCSSClass;
    this.resultsElement = resultsElement;
    this.showQueryParams = showQueryParams;
    this.activeCSSClass = activeCSSClass;
    this.debouncing = debouncing;

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

    getQueryParams(this);

    this.applyFilters();

    this.listenEvents();
  }

  /**
   * Listens for internal events.
   */
  private async listenEvents() {
    const { form, resetButtonsData, submitButton, debouncing } = this;

    // Form
    form.addEventListener('submit', (e) => this.handleSubmit(e));
    form.addEventListener(
      'input',
      debounce((e: Event) => this.handleInputEvents(e), debouncing)
    );

    // Reset buttons
    for (const [resetButton, filterKeys] of resetButtonsData) {
      resetButton?.addEventListener('click', () => this.resetFilters(filterKeys));
    }

    // Submit button visibility
    if (submitButton) {
      window.addEventListener(
        'resize',
        debounce(() => {
          this.submitButtonVisible = isVisible(submitButton);
        }, 50)
      );
    }
  }

  /**
   * Handles input events.
   * @param e The `InputEvent`.
   */
  private async handleInputEvents({ target }: Event) {
    const { submitButtonVisible, filtersData, activeCSSClass } = this;

    if (!isFormField(target)) return;

    const validInput = handleFilterInput(target, filtersData, activeCSSClass);
    if (!validInput) return;

    if (!submitButtonVisible) await this.applyFilters();
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
   *
   * @param syncTags Defines if the {@link CMSTags} instance should be syncronized. Defaults to `true`.
   */
  public async applyFilters(addingItems?: boolean, syncTags = true): Promise<void> {
    const { listInstance, filtersData, filtersActive, highlightResults, tagsInstance, showQueryParams } = this;
    const { items, currentPage } = listInstance;

    // Abort if no filtering is needed
    const filtersAreEmpty = filtersData.every(({ values }) => !values.size);

    if (filtersAreEmpty && !filtersActive) return;

    this.filtersActive = !filtersAreEmpty;

    // Define show/hide of each item based on the match
    for (const item of items) {
      item.valid = assessFilter(item, filtersData, filtersAreEmpty, highlightResults);
    }

    // Render the items
    if (!addingItems) {
      if (currentPage) listInstance.currentPage = 1;

      listInstance.scrollToAnchor();

      if (showQueryParams) setQueryParams(filtersData);

      await Promise.all([
        // Render items
        listInstance.renderItems(),

        // Sync the `CMSTags`
        (async () => {
          if (syncTags) await tagsInstance?.syncTags();
        })(),
      ]);
    }
  }

  /**
   * Resets the active filters.
   * @param filterKey If passed, only this filter key will be resetted.
   * @param value If passed, only that specific value and the elements that hold it will be cleared.
   */
  public async resetFilters(filterKeys?: string[], value?: string): Promise<void> {
    const { filtersData } = this;

    if (!filterKeys || !filterKeys.length) for (const filterData of filtersData) clearFilterData(filterData);
    else {
      const filterData = filtersData.find((data) => sameValues(data.filterKeys, filterKeys));
      if (!filterData) return;

      clearFilterData(filterData, value);
    }

    const syncTags = !value;

    await this.applyFilters(false, syncTags);
  }

  /**
   * Adds a {@link CMSTags} instance.
   * @param tagsInstance The `CMSTags` instance.
   */
  public async addTagsInstance(tagsInstance: CMSTags) {
    this.tagsInstance = tagsInstance;

    await tagsInstance.syncTags();
  }
}
