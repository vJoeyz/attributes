import { cloneNode, FormField, Greenhouse } from '@finsweet/ts-utils';
import { DROPDOWN_CSS_CLASSES } from '@finsweet/ts-utils';
import type { CMSFilters } from 'packages/cmsfilter/src/components/CMSFilters';
import type { FiltersData } from 'packages/cmsfilter/src/utils/types';

import { ATTRIBUTES, queryElement } from '../utils/constants';
import { fetchDepartments, fetchJobs, fetchOffices } from '../utils/fetch';
import { appendJobsNestedList, getNestedKey } from './jobs';

export async function createFilters(
  boardId: string,
  queryParam: string,
  filtersInstances: CMSFilters[],
  filtersElements: FormField[]
) {
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

    const displayElements = [
      ...queryElement<HTMLElement>(ATTRIBUTES.element.values.display, {
        all: true,
      }),
    ];

    const defaultValues = new Map<HTMLElement, string>();

    const { listInstance } = filterInstance;

    const groupByKey = getNestedKey(listInstance);

    listInstance.on('renderitems', async () => {
      const { filtersData } = filterInstance;

      if (displayElements.length > 0) {
        displayFilterValues(filtersData, displayElements, defaultValues);
      }

      if (groupByKey) {
        const deparmentsFilter = filtersData.find((filterData) => filterData.filterKeys.includes('departments'));
        const officesFilter = filtersData.find((filterData) => filterData.filterKeys.includes('offices'));

        // Retrieve the selected option from the Set
        const departmentValues = (deparmentsFilter && [...deparmentsFilter.values]) || null;
        const officeValues = (officesFilter && [...officesFilter.values]) || null;

        const jobs = await filterJobs(boardId, departmentValues, officeValues);

        listInstance.wrapper.innerHTML = '';

        appendJobsNestedList(listInstance, jobs, queryParam, groupByKey);
      }
    });
  }

  for (const filterInstance of filtersInstances) {
    filterInstance.storeFiltersData();
    filterInstance.resetFilters();
  }
}

async function filterJobs(boardId: string, departmentValues: string[] | null, officeValues: string[] | null) {
  const allJobs = await fetchJobs(boardId);

  const jobsDeparments =
    (departmentValues &&
      departmentValues.length > 0 &&
      allJobs.filter((job: Greenhouse.Job | Greenhouse.JobWithContent) => {
        if (!job.hasOwnProperty('departments')) {
          return false;
        }

        const departments = (job as Greenhouse.JobWithContent).departments.map((department) => department.name);

        return departments.some((department) =>
          departmentValues.some((deparmentValue) => deparmentValue === department)
        );
      })) ||
    allJobs;

  const jobs =
    (officeValues &&
      officeValues.length > 0 &&
      jobsDeparments.filter((job: Greenhouse.Job | Greenhouse.JobWithContent) => {
        if (!job.hasOwnProperty('offices')) {
          return false;
        }

        const offices = (job as Greenhouse.JobWithContent).offices.map((office) => office.name);

        return offices.some((office) => officeValues.some((officeValue) => officeValue === office));
      })) ||
    jobsDeparments;

  return jobs;
}

function displayFilterValues(
  filtersData: FiltersData,
  displayElements: HTMLElement[],
  defaultValues: Map<HTMLElement, string>
) {
  for (const displayElement of displayElements) {
    const { textContent } = displayElement;

    const defaultValue: string | null | undefined = defaultValues.has(displayElement)
      ? defaultValues.get(displayElement)
      : defaultValues.set(displayElement, textContent || 'All') && textContent;
    const key = displayElement.getAttribute(ATTRIBUTES.display.key);

    if (!key) {
      continue;
    }

    const filteredKey = filtersData.find((filterData) => filterData.filterKeys.includes(key));

    if (!filteredKey) {
      continue;
    }

    const values = [...filteredKey.values];

    if (values.length <= 0 && defaultValue) {
      displayElement.textContent = defaultValue;
      continue;
    }

    displayElement.textContent = values.join(', ');
  }
}

export function createFilterFactory(
  fieldElement: FormField,
  category: Greenhouse.Department['name'][] | Greenhouse.Job['location']['name'][] | Greenhouse.Office['name'][]
): void {
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
}

export async function fetchFilterData(boardId: string, filterKey: string): Promise<string[]> {
  switch (filterKey) {
    case 'departments':
      return fetchDepartments(boardId);
    case 'offices':
      return fetchOffices(boardId);
    default:
      return [];
  }
}
