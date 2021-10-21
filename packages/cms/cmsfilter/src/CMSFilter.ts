import debounce from 'just-debounce';
import { ANIMATIONS } from 'packages/cms/animations';
import { MATCHES, MODES, RANGE_MODES } from './constants';
import { assessFilter } from './filter';
import { clearFormField, isFormField, isKeyOf } from '@finsweet/ts-utils';
import { collectFiltersData, collectFiltersElements, collectItemsProps } from './collect';

import type { FormBlockElement, FormField } from '@finsweet/ts-utils';
import type { CMSItem, CMSList } from 'packages/cms/CMSList';

// Types
type FilterMatch = typeof MATCHES[number];
type FilterMode = typeof MODES[number];
export type FiltersData = Map<
  FormField,
  {
    filterKeys: string[];
    match?: FilterMatch;
    mode?: FilterMode;
    fixedValue?: string | null;
  }
>;

export type GrouppedFilterKeys = string[][];

export type FiltersValues = Map<
  string,
  {
    values: Set<string | undefined>;
    match?: FilterMatch;
    mode?: FilterMode;
    type?: string;
  }
>;

export type ResetButtonsData = Map<HTMLElement, string | null>;

export class CMSFilters {
  public readonly form: HTMLFormElement;
  public readonly resetButtonsData: ResetButtonsData;
  public readonly submitButton: HTMLInputElement | null;
  public readonly filtersData: FiltersData;
  public readonly grouppedFilterKeys: GrouppedFilterKeys;
  public readonly filtersValues: FiltersValues = new Map();

  private filtersActive = false;
  private emptyState = false;

  constructor(
    public readonly formBlock: FormBlockElement,
    private readonly emptyElement: HTMLElement | null,
    private readonly listInstance: CMSList
  ) {
    const { form, submitButton, resetButtonsData } = collectFiltersElements(formBlock);
    this.form = form;
    this.submitButton = submitButton;
    this.resetButtonsData = resetButtonsData;

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

    for (const [resetButton, filterKey] of resetButtons.entries()) {
      resetButton?.addEventListener('click', () => this.resetFilters(filterKey));
    }

    const handleItems = (items: CMSItem[]) => {
      collectItemsProps(items);
      this.applyFilters(items, false);
    };

    listInstance.on('additems', handleItems);
    listInstance.on('nestitems', handleItems);
  }

  /**
   * Handles input events.
   * @param e The `InputEvent`.
   */
  private async handleInputEvents({ target }: Event) {
    const { filtersData, filtersValues, submitButton } = this;

    if (!isFormField(target)) return;

    const filterData = filtersData.get(target);
    if (!filterData) return;

    const { filterKeys, fixedValue, mode, match } = filterData;
    const { type, value } = target;

    const properties = {
      mode,
      match,
      type,
    } as const;

    for (const filterKey of filterKeys) {
      const existingFilter = filtersValues.get(filterKey);

      if (existingFilter) Object.assign(existingFilter, properties);

      switch (type) {
        case 'checkbox': {
          const { checked } = <HTMLInputElement>target;

          if (existingFilter) {
            if (fixedValue) {
              existingFilter.values[checked ? 'add' : 'delete'](fixedValue);
              if (!existingFilter.values.size) filtersValues.delete(filterKey);
            } else if (checked) existingFilter.values = new Set([`${checked}`]);
            else filtersValues.delete(filterKey);

            break;
          }

          filtersValues.set(filterKey, {
            ...properties,
            values: new Set([checked && fixedValue ? fixedValue : `${checked}`]),
          });

          break;
        }

        case 'radio': {
          const { checked } = <HTMLInputElement>target;

          if (checked && fixedValue) {
            if (existingFilter) {
              existingFilter.values = new Set([fixedValue]);

              break;
            }

            filtersValues.set(filterKey, {
              ...properties,
              values: new Set([fixedValue]),
            });

            break;
          }

          filtersValues.delete(filterKey);

          break;
        }

        default: {
          if (!value && !isKeyOf(mode, RANGE_MODES)) {
            filtersValues.delete(filterKey);
            break;
          }

          if (existingFilter) {
            if (isKeyOf(mode, RANGE_MODES)) {
              const newValues = [...existingFilter.values];
              newValues[mode === 'from' ? 0 : 1] = value;

              existingFilter.values = new Set(newValues);
            } else existingFilter.values = new Set([value]);

            break;
          }

          filtersValues.set(filterKey, {
            ...properties,
            values: mode === 'to' ? new Set([, value]) : new Set([value]),
          });

          break;
        }
      }
    }

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
   * @param items Optional list of `CMSItem` instances. If passed, only those instances will be filtered.
   * @param animateList When set to `true`, the list will fade out and fade in during the filtering process.
   */
  public async applyFilters(items?: CMSItem[], animateList = true): Promise<void> {
    const { listInstance, filtersValues, grouppedFilterKeys, filtersActive, emptyElement, emptyState } = this;

    const filtersExist = !!filtersValues.size;

    if (!filtersExist && !filtersActive) return;

    this.setFiltersActive(filtersExist);

    const filters = [...filtersValues.entries()];
    const filtersAreEmpty = filters.every(([, { values }]) => !values.size);

    const { fade } = ANIMATIONS;
    const { wrapper, list } = listInstance;

    if (animateList) await fade.out(wrapper);

    const itemsToShow: CMSItem[] = [];
    const itemsToHide: CMSItem[] = [];

    for (const item of items || listInstance.items) {
      const show = filtersAreEmpty || assessFilter(item, filters, grouppedFilterKeys);

      (show ? itemsToShow : itemsToHide).push(item);
    }

    await listInstance.renderItems(itemsToHide, false, !animateList);
    await listInstance.renderItems(itemsToShow, true, !animateList);

    if (!items && emptyElement) {
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

    if (animateList) await fade.in(wrapper);
  }

  /**
   * Resets the active filters.
   * @param filterKey If passed, only this filter key will be resetted.
   */
  public resetFilters(filterKey?: string | null): void {
    const { filtersData, filtersValues } = this;

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

    this.applyFilters();
  }
}
