import { cloneNode, FormField, Greenhouse } from '@finsweet/ts-utils';
import { DROPDOWN_CSS_CLASSES } from '@finsweet/ts-utils';
import type { CMSFilters } from 'packages/cmsfilter/src/components/CMSFilters';

import { fetchFilterData } from '../actions/filter';
import { ATTRIBUTES, queryElement } from '../utils/constants';

export async function createFilters(boardId: string, filtersInstances: CMSFilters[], filtersElements: FormField[]) {
  if (filtersElements.length <= 0) {
    return;
  }

  for (const filterInstance of filtersInstances) {
    for (const filterElement of filtersElements) {
      const filterKey = filterElement.getAttribute(ATTRIBUTES.filter.key);

      if (!filterKey) {
        return;
      }

      const filterEntries = await fetchFilterData(boardId, filterKey);

      if (!filterEntries || filterEntries.length <= 0) {
        return;
      }

      createFilterFactory(filterElement, filterEntries);
    }
    filterInstance.storeFiltersData();
    filterInstance.resetFilters();

    const displayElements = queryElement<HTMLInputElement | HTMLSelectElement>(ATTRIBUTES.element.values.display, {
      all: true,
    });

    if (displayElements.length <= 0) {
      continue;
    }

    const defaultValues = new Map();

    const { listInstance } = filterInstance;

    listInstance.on('renderitems', () => {
      const { filtersData } = filterInstance;

      for (const displayElement of displayElements) {
        const defaultValue: string = defaultValues.has(displayElement)
          ? defaultValues.get(displayElement)
          : defaultValues.set(displayElement, displayElement.textContent) && displayElement.textContent;
        const key = displayElement.getAttribute(ATTRIBUTES.display.key);

        if (!key) {
          continue;
        }

        const filteredKey = filtersData.find((filterData) => filterData.filterKeys.includes(key));

        if (!filteredKey) {
          continue;
        }

        const values = [...filteredKey.values];

        if (values.length <= 0) {
          displayElement.textContent = defaultValue;
          continue;
        }

        displayElement.textContent = values.join(', ');
      }
    });
  }
}

export const createFilterFactory = (
  fieldElement: FormField,
  category: Greenhouse.Department['name'][] | Greenhouse.Job['location']['name'][] | Greenhouse.Office['name'][]
): void => {
  if (fieldElement instanceof HTMLSelectElement) {
    fieldElement.innerHTML = '';
    fieldElement.add(new Option('All', ''));
    category.forEach((category) => {
      // TODO: flatten out the option values to this format: value-name
      fieldElement.add(new Option(category, category));
    });
    return;
  }

  const dropdown = fieldElement.closest<HTMLElement>(`.${DROPDOWN_CSS_CLASSES.dropdown}`);

  if (dropdown) {
    const dropdownNav = dropdown.querySelector<HTMLElement>(`.${DROPDOWN_CSS_CLASSES.dropdownList}`);

    if (!dropdownNav) {
      return;
    }

    const dropdownList = dropdownNav.querySelector<HTMLElement>('ul');

    if (!dropdownList) {
      return;
    }

    const dropdownItem = dropdownList.querySelector<HTMLElement>('li');

    if (!dropdownItem) {
      return;
    }

    category.forEach((category) => {
      const newDropdownItem = cloneNode(dropdownItem);

      const labelItem = newDropdownItem.querySelector<HTMLLabelElement>('.w-form-label');

      if (!labelItem) {
        return;
      }

      labelItem.textContent = category;

      dropdownList.append(newDropdownItem);
    });

    dropdownItem.remove();

    // console.log(dropdownItem);
  }
};
