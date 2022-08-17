import { CMS_CSS_CLASSES, DROPDOWN_CSS_CLASSES } from '@finsweet/ts-utils';
import type { OfficesResponse, DepartmentsResponse } from '@finsweet/ts-utils/dist/types/apis/Greenhouse';
import type { CMSList } from 'packages/cmscore/src';

import { ATTRIBUTES, getSelector } from '../utils/constants';
import { GH_API_BASE } from '../utils/constants';

export async function createJobListFilter(listInstances: CMSList[], filter: HTMLElement, boardId: string) {
  const filterKey = filter.getAttribute(ATTRIBUTES.filter.key);

  if (!filterKey) {
    return;
  }

  const filterData = await fetchFilterData(boardId, filterKey);

  if (filter instanceof HTMLSelectElement) {
    createSelectFilter(listInstances, filter, filterData);
    return;
  }

  if (filter.classList.contains(DROPDOWN_CSS_CLASSES.dropdown)) {
    createDropdownFilter(listInstances, filter, filterData);
    return;
  }

  return;
}

function createSelectFilter(listInstances: CMSList[], filterElement: HTMLSelectElement, values: string[]) {
  filterElement.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.text = 'All';
  defaultOption.value = '';
  filterElement.add(defaultOption);

  for (const value of values) {
    const newOption = document.createElement('option');
    newOption.text = value;
    newOption.value = value;
    filterElement.add(newOption);
  }

  filterElement.addEventListener('change', function () {
    filterEvent(listInstances, this.value);
  });
}

function filterNestedList(wrapper: HTMLDivElement, value: string) {
  const items = wrapper.querySelectorAll<HTMLDivElement>(
    `:scope > .${CMS_CSS_CLASSES.list} > .${CMS_CSS_CLASSES.item}`
  );

  for (const item of items) {
    const groupByElement = item.querySelector<HTMLElement>(getSelector('element', ATTRIBUTES.element.values.groupby));

    const groupName = groupByElement?.textContent || '';

    if (groupName === value || value === '') {
      item.style.setProperty('display', 'block');
      continue;
    }

    item.style.setProperty('display', 'none');
  }
}

function filterList(value: string) {
  console.log('not implemented yet', value);
}

function createDropdownFilter(listInstances: CMSList[], filterElement: HTMLElement, values: string[]) {
  const dropdownList = filterElement.querySelector<HTMLElement>(`.${DROPDOWN_CSS_CLASSES.dropdownList}`);
  const dropdownToggle = filterElement.querySelector<HTMLElement>(`.${DROPDOWN_CSS_CLASSES.dropdownToggle}`);

  if (!dropdownList || !dropdownToggle) {
    return;
  }
  const dropdownItems = dropdownList.querySelectorAll<HTMLElement>(`:scope > *`);

  const dropdownTemplate = dropdownItems[0];

  if (!dropdownTemplate) {
    return;
  }

  const defaultDropdown = dropdownTemplate.cloneNode(true) as HTMLElement;
  defaultDropdown.textContent = 'All';
  dropdownList.append(defaultDropdown);
  defaultDropdown.addEventListener('click', function () {
    filterEvent(listInstances, '');
  });

  for (const value of values) {
    const newDropdown = dropdownTemplate.cloneNode(true) as HTMLElement;
    newDropdown.textContent = value;
    dropdownList.append(newDropdown);

    newDropdown.addEventListener('click', function () {
      filterEvent(listInstances, value);
    });
  }

  for (const dropdownItem of dropdownItems) {
    dropdownItem.remove();
  }
}

function filterEvent(listInstances: CMSList[], value: string) {
  for (const listInstance of listInstances) {
    const { wrapper } = listInstance;

    if (!wrapper) {
      continue;
    }

    const groupBy = wrapper.getAttribute(ATTRIBUTES.groupBy.key);
    const nestedWrapper = wrapper.querySelector<HTMLElement>(`.${CMS_CSS_CLASSES.wrapper}`);

    const isNested = !!(groupBy && nestedWrapper);

    if (isNested) {
      filterNestedList(wrapper, value);
      continue;
    }

    filterList(value);
  }
}

async function fetchFilterData(boardId: string, filterKey: string): Promise<string[]> {
  switch (filterKey) {
    case 'departments':
      return fetchDepartments(boardId);
    case 'offices':
      return fetchOffices(boardId);
    default:
      return [];
  }
}

/**
 * Fetches departments from Greenhouse
 * @returns an array of {@link Greenhouse.Office} objects
 */
async function fetchOffices(boardId: string): Promise<string[]> {
  try {
    // Call the API
    const endpoint = `${GH_API_BASE}${boardId}/offices`;
    const response = await fetch(endpoint);
    const data: OfficesResponse = await response.json();

    return data.offices.map((office) => office.name);
  } catch (error) {
    return [];
  }
}

// OPEN POSITION HELPERS

/**
 * Fetches departments and jobs from Greenhouse
 * @returns an array of {@link Department} objects
 */
async function fetchDepartments(boardId: string): Promise<string[]> {
  try {
    // Call the API
    const endpoint = `${GH_API_BASE}${boardId}/departments`;
    const response = await fetch(endpoint);
    const data: DepartmentsResponse = await response.json();

    // Filter out departments with no jobs
    const departments = data.departments.filter((department) => department.jobs.length > 0);
    return departments.map((department) => department.name);
  } catch (error) {
    return [];
  }
}
