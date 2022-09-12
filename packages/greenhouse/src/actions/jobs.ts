import { CMSItem, CMSList } from '@finsweet/attributes-cmscore';
import { importCMSCore } from '@finsweet/attributes-cmscore';
import { CMS_CSS_CLASSES } from '@finsweet/ts-utils';
import type { JobWithContent } from '@finsweet/ts-utils/dist/types/apis/Greenhouse';

import { ATTRIBUTES, SUPPORTED_NESTED_KEYS } from '../utils/constants';
import { filterJobsByKey, getDepartmentsOrOfficesFromJobs } from '../utils/jobs';
import { populateJob } from '../utils/populate';

export async function createCMSList(listWrapper: HTMLElement, queryParam: string, jobs: JobWithContent[]) {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  // Create the list instances
  const listInstance = cmsCore.createCMSListInstance(listWrapper);

  if (!listInstance) {
    return;
  }

  await addJobsCMSList(listInstance, queryParam, jobs);
}

export async function addJobsCMSList(listInstance: CMSList, queryParam: string, jobs: JobWithContent[]) {
  const groupByKey = getNestedKey(listInstance);

  if (groupByKey) {
    addNestedJobsToCMSItems(listInstance, jobs, queryParam, groupByKey);
    return;
  }

  addJobsToCMSItems(listInstance, jobs, queryParam);
}

function addJobsToCMSItems(listInstance: CMSList, jobs: JobWithContent[], queryParam: string) {
  const templateItems = [...listInstance.items];

  const template: CMSItem = templateItems[0];

  if (!template) {
    return;
  }

  const { element } = template;

  const jobElements = jobs.map((job: JobWithContent) => {
    const jobItemElement: HTMLDivElement = element.cloneNode(true) as HTMLDivElement;

    return populateJob(job, jobItemElement, queryParam) as HTMLDivElement;
  });

  listInstance.clearItems(true);
  listInstance.addItems(jobElements);
}

export function addNestedJobsToCMSItems(
  listInstance: CMSList,
  jobs: JobWithContent[],
  queryParam: string,
  groupBy: string
) {
  const mainItems = [...listInstance.items];

  const mainTemplate: CMSItem = mainItems[0];

  const jobsGroups: string[] = getDepartmentsOrOfficesFromJobs(jobs, groupBy);

  const groupBySections: HTMLDivElement[] = jobsGroups.map((jobGroup) => {
    const mainItem: HTMLDivElement = mainTemplate.element.cloneNode(true) as HTMLDivElement;

    const groupByLabel = mainItem.querySelector<HTMLElement>(`[${ATTRIBUTES.element.key}="${groupBy}"]`);

    if (groupByLabel) {
      groupByLabel.textContent = jobGroup;
    }

    const jobsWrapper = mainItem.querySelector<HTMLDivElement>(`.${CMS_CSS_CLASSES.wrapper}`);

    if (!jobsWrapper) {
      return mainItem;
    }

    const jobsList = new CMSList(jobsWrapper, 0);

    const jobsTemplateItems = [...jobsList.items];

    const jobTemplate = jobsTemplateItems[0];
    const jobsFromGroup = filterJobsByKey(jobs, groupBy, jobGroup);

    const jobElements = jobsFromGroup.map((job: JobWithContent) => {
      const jobItemElement: HTMLDivElement = jobTemplate.element.cloneNode(true) as HTMLDivElement;

      return populateJob(job, jobItemElement, queryParam) as HTMLDivElement;
    });

    for (const templateItem of jobsTemplateItems) {
      templateItem.element.remove();
    }
    jobsList.addItems(jobElements);

    return mainItem;
  });

  listInstance.clearItems(true);

  listInstance?.addItems(groupBySections);
}

export function appendNestedJobsToCMSItems(
  listInstance: CMSList,
  jobs: JobWithContent[],
  queryParam: string,
  groupBy: string
) {
  const mainItems = [...listInstance.items];

  const mainTemplate: CMSItem = mainItems[0];

  const jobsGroups: string[] = getDepartmentsOrOfficesFromJobs(jobs, groupBy);

  jobsGroups.forEach((jobGroup) => {
    const mainItem: HTMLDivElement = mainTemplate.element.cloneNode(true) as HTMLDivElement;

    const groupByLabel = mainItem.querySelector<HTMLElement>(`[${ATTRIBUTES.element.key}="${groupBy}"]`);

    if (groupByLabel) {
      groupByLabel.textContent = jobGroup;
    }

    const jobsWrapper = mainItem.querySelector<HTMLDivElement>(`.${CMS_CSS_CLASSES.wrapper}`);

    if (!jobsWrapper) {
      return;
    }

    const jobsList = new CMSList(jobsWrapper, 0);

    const jobsTemplateItems = [...jobsList.items];

    jobsWrapper.innerHTML = '';

    const jobTemplate = jobsTemplateItems[0];

    const jobsFromGroup = filterJobsByKey(jobs, groupBy, jobGroup);

    jobsFromGroup.forEach((job: JobWithContent) => {
      const jobItemElement: HTMLDivElement = jobTemplate.element.cloneNode(true) as HTMLDivElement;

      const jobElement = populateJob(job, jobItemElement, queryParam) as HTMLDivElement;
      jobsList.wrapper.append(jobElement);
    });

    listInstance.wrapper.append(mainItem);
  });
}

export function getNestedKey(listInstance: CMSList): string | null {
  const templateItem = [...listInstance.items][0];

  const { element } = templateItem;

  const nestedList = element.querySelector<HTMLDivElement>(`.${CMS_CSS_CLASSES.wrapper}`);

  if (!nestedList) {
    return null;
  }

  const groupBy = [...element.querySelectorAll<HTMLElement>(`[${ATTRIBUTES.element.key}]`)].find((groupElement) => {
    const elementAttribute = groupElement.getAttribute(ATTRIBUTES.element.key);

    if (!elementAttribute) {
      return false;
    }

    return (groupElement.contains(element) === false && SUPPORTED_NESTED_KEYS.includes(elementAttribute)) || false;
  });

  return (groupBy && groupBy.getAttribute(ATTRIBUTES.element.key)) || null;
}
