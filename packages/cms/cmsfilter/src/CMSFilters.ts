import debounce from 'just-debounce';
import { assessFilter, clearFilterData } from './filter';
import { getQueryParams, setQueryParams } from './query';
import { handleFilterInput } from './input';
import { ATTRIBUTES } from './constants';
import { isFormField, sameValues } from '@finsweet/ts-utils';
import { collectFiltersData, collectFiltersElements } from './collect';

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
  public readonly form;
  public readonly resultsElement;
  public readonly resetButtonsData;
  public readonly submitButton;
  public readonly filtersData;

  private readonly showQueryParams;
  private readonly scrollTop;

  private filtersActive = false;
  private tagsInstance?: CMSTags;

  constructor(
    public readonly formBlock: FormBlockElement,
    public readonly listInstance: CMSList,
    {
      resultsElement,
      showQueryParams,
      scrollTop,
    }: {
      resultsElement: HTMLElement | null;
      showQueryParams: boolean;
      scrollTop: boolean;
    }
  ) {
    const { form, submitButton, resetButtonsData } = collectFiltersElements(formBlock);
    this.form = form;
    this.submitButton = submitButton;
    this.resetButtonsData = resetButtonsData;

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
      listInstance: { items },
    } = this;

    for (const item of items) item.collectProps({ fieldKey, rangeKey, typeKey });

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
   * Updates the displayed results on the `resultsElement`.
   */
  public updateResults() {
    const {
      resultsElement,
      listInstance: { visibleItems },
    } = this;

    if (resultsElement) resultsElement.textContent = `${visibleItems}`;
  }

  /**
   * Mutates each `CMSItem`'s state to define if it should be displayed or not.
   *
   * @param addingItems Defines if new items are being added.
   * In that case, the rendering responsibilities are handled by another controller.
   */
  public async applyFilters(addingItems?: boolean): Promise<void> {
    const { listInstance, filtersData, filtersActive, scrollTop } = this;
    const { items, currentPage } = listInstance;

    // Abort if no filtering is needed
    const filtersAreEmpty = filtersData.every(({ values }) => !values.size);

    if (filtersAreEmpty && !filtersActive) return;

    this.filtersActive = !filtersAreEmpty;

    // Define show/hide of each item based on the match
    for (const item of items) item.mustShow = filtersAreEmpty || assessFilter(item, filtersData);

    // Render the items
    if (!addingItems) {
      if (currentPage) listInstance.currentPage = 1;

      await listInstance.renderItems();

      if (scrollTop) this.scrollToTop();
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

    if (showQueryParams) setQueryParams(filtersData);

    if (!value && tagsInstance) tagsInstance.syncTags(filtersData);

    await this.applyFilters();
  }

  /**
   * Scrolls to the top of the list.
   */
  public scrollToTop() {
    this.listInstance.wrapper.parentElement?.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Adds a {@link CMSTags} instance.
   * @param tagsInstance The `CMSTags` instance.
   */
  public async addTagsInstance(tagsInstance: CMSTags) {
    const { filtersData } = this;

    this.tagsInstance = tagsInstance;

    tagsInstance.on('tagremove', async ({ filterKeys, value }) => await this.resetFilters(filterKeys, value));

    await tagsInstance.syncTags(filtersData);
  }
}
