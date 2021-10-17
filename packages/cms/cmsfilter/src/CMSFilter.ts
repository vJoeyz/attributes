import debounce from 'just-debounce';
import { ANIMATIONS } from 'packages/cms/animations';
import { MODES } from './constants';
import { assessFilter } from './filter';
import { clearFormField, isFormField } from '@finsweet/ts-utils';
import { collectFiltersData, collectFiltersElements, collectItemsProps } from './collect';

import type { FormBlockElement, FormField } from '@finsweet/ts-utils';
import type { CMSItem, CMSList } from 'packages/cms/CMSList';

// Types
type FilterMode = typeof MODES[number];
export type FiltersData = Map<
  FormField,
  {
    filterKey: string;
    mode?: FilterMode;
    fixedValue?: string | null;
  }
>;

type FilterMatch = 'any' | 'all' | 'range';
export type ActiveFilters = Map<
  string,
  {
    values: Set<string | undefined>;
    match?: FilterMatch;
    type?: string;
  }
>;

export type ResetButtonsData = Map<HTMLElement, string | null>;

export class CMSFilters {
  public readonly form: HTMLFormElement;
  public readonly resetButtonsData: ResetButtonsData;
  public readonly submitButton: HTMLInputElement | null;
  public readonly filtersData: FiltersData;
  public readonly activeFilters: ActiveFilters = new Map();

  constructor(public readonly formBlock: FormBlockElement, private readonly listInstance: CMSList) {
    const { form, submitButton, resetButtonsData } = collectFiltersElements(formBlock);
    this.form = form;
    this.submitButton = submitButton;
    this.resetButtonsData = resetButtonsData;

    this.filtersData = collectFiltersData(form);

    listInstance.autoShowNewItems = false;

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

    listInstance.on('additems', (newItems) => {
      collectItemsProps(newItems);
      this.applyFilters(newItems, false);
    });
  }

  /**
   * Handles input events.
   * @param e The `InputEvent`.
   */
  private async handleInputEvents({ target }: Event) {
    const { filtersData, activeFilters, submitButton } = this;

    if (!isFormField(target)) return;

    const filterData = filtersData.get(target);
    if (!filterData) return;

    const { filterKey, fixedValue, mode } = filterData;
    const { type, value } = target;

    const match: FilterMatch | undefined = mode === 'from' || mode === 'to' ? 'range' : mode;

    const existingFilter = activeFilters.get(filterKey);

    if (existingFilter) {
      existingFilter.match = match;
      existingFilter.type = type;
    }

    switch (type) {
      case 'checkbox': {
        const { checked } = <HTMLInputElement>target;

        if (existingFilter) {
          if (fixedValue) {
            existingFilter.values[checked ? 'add' : 'delete'](fixedValue);
            if (!existingFilter.values.size) activeFilters.delete(filterKey);
          } else if (checked) existingFilter.values = new Set([`${checked}`]);
          else activeFilters.delete(filterKey);

          break;
        }

        activeFilters.set(filterKey, {
          match,
          type,
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

          activeFilters.set(filterKey, {
            match,
            type,
            values: new Set([fixedValue]),
          });

          break;
        }

        activeFilters.delete(filterKey);

        break;
      }

      default: {
        if (!value && match !== 'range') {
          activeFilters.delete(filterKey);
          break;
        }

        if (existingFilter) {
          if (match === 'range') {
            const newValues = [...existingFilter.values];
            newValues[mode === 'from' ? 0 : 1] = value;

            existingFilter.values = new Set(newValues);
          } else existingFilter.values = new Set([value]);

          break;
        }

        activeFilters.set(filterKey, {
          match,
          type,
          values: match === 'range' ? new Set(mode === 'from' ? [value] : [, value]) : new Set([value]),
        });

        break;
      }
    }

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
   * Applies the active filters to the list.
   */
  public async applyFilters(items?: CMSItem[], animate = true): Promise<void> {
    const { listInstance, activeFilters } = this;

    console.log(activeFilters);

    const filters = [...activeFilters.entries()];
    const filtersAreEmpty = filters.every(([, { values }]) => !values.size);

    const { fade } = ANIMATIONS;
    const { list } = listInstance;

    if (animate) await fade.out(list);

    for (const item of items || listInstance.items) {
      const show = filtersAreEmpty || assessFilter(item, filters);

      listInstance.showItems(item, show, !animate);
    }

    if (animate) await fade.in(list);
  }

  /**
   * Resets the active filters.
   * @param filterKey If passed, only this filter key will be resetted.
   */
  public resetFilters(filterKey?: string | null): void {
    const { filtersData, activeFilters } = this;

    if (filterKey) {
      const formFieldsToClear = [...filtersData.entries()]
        .filter(([, data]) => filterKey === data.filterKey)
        .map(([formField]) => formField);

      for (const formField of formFieldsToClear) clearFormField(formField, ['input']);

      activeFilters.delete(filterKey);
    } else {
      for (const formField of filtersData.keys()) clearFormField(formField, ['input']);
      activeFilters.clear();
    }

    this.applyFilters();
  }
}
