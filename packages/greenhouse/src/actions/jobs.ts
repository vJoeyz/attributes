import { CMSItem, CMSList } from '@finsweet/attributes-cmscore';
import { importCMSCore } from '@finsweet/attributes-cmscore';
import { isNotEmpty } from '@finsweet/ts-utils';
import { CMS_CSS_CLASSES } from '@finsweet/ts-utils';
import type { Job, JobWithContent } from '@finsweet/ts-utils/dist/types/apis/Greenhouse';

import { ATTRIBUTES, getSelector } from '../utils/constants';
import { fetchJobs } from '../utils/fetch';
import { populateJob } from '../utils/populate';

export async function createJobList(listWrapper: HTMLElement, boardId: string, queryParam: string) {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  const jobs = await fetchJobs(boardId);
  // Create the list instances
  const listInstance = cmsCore.createCMSListInstance(listWrapper);

  if (!listInstance) {
    return;
  }

  // listInstances.forEach((listInstance) => {
  const { wrapper } = listInstance;

  const groupBy = wrapper.getAttribute(ATTRIBUTES.groupBy.key);
  const nestedWrapper = wrapper.querySelector<HTMLElement>(`.${CMS_CSS_CLASSES.wrapper}`);

  if (!groupBy || !nestedWrapper) {
    createJobsDefaultList(listInstance, jobs, queryParam);
    return;
  }

  createJobsNestedList(listInstance, jobs, queryParam, groupBy);

  // return listInstances;
}

export async function addJobsToList(listInstance: CMSList, boardId: string, queryParam: string) {
  const jobs = await fetchJobs(boardId);

  const { wrapper } = listInstance;

  const groupBy = wrapper.getAttribute(ATTRIBUTES.groupBy.key);
  const nestedWrapper = wrapper.querySelector<HTMLElement>(`.${CMS_CSS_CLASSES.wrapper}`);

  if (!groupBy || !nestedWrapper) {
    createJobsDefaultList(listInstance, jobs, queryParam);
    return;
  }

  createJobsNestedList(listInstance, jobs, queryParam, groupBy);
}

function createJobsDefaultList(listInstance: CMSList, jobs: (Job | JobWithContent)[], queryParam: string) {
  const templateItems = [...listInstance.items];

  const template: CMSItem = templateItems[0];

  if (!template) {
    return;
  }

  const { element } = template;

  const jobElements = jobs.map((job: Job | JobWithContent) => {
    const jobItemElement: HTMLDivElement = element.cloneNode(true) as HTMLDivElement;

    return populateJob(job, jobItemElement, queryParam) as HTMLDivElement;
  });

  listInstance.clearItems(true);
  listInstance.addItems(jobElements);
}

function createJobsNestedList(
  listInstance: CMSList,
  jobs: (Job | JobWithContent)[],
  queryParam: string,
  groupBy: string
) {
  const principalItems = [...listInstance.items];

  const groupByTemplate: CMSItem = principalItems[0];

  const jobsGroups: string[] = getGroupByKeys(jobs, groupBy);

  const groupBySections: HTMLDivElement[] = jobsGroups.map((jobGroup) => {
    const groupItem: HTMLDivElement = groupByTemplate.element.cloneNode(true) as HTMLDivElement;

    // label
    const groupByLabel = groupItem.querySelector<HTMLElement>(
      getSelector('element', ATTRIBUTES.element.values.groupby)
    );

    if (groupByLabel) {
      groupByLabel.textContent = jobGroup;
    }

    const jobsWrapper = groupItem.querySelector<HTMLDivElement>('.w-dyn-list');

    if (!jobsWrapper) {
      return groupItem;
    }

    const jobsList = new CMSList(jobsWrapper, 0);

    const jobsTemplateItems = [...jobsList.items];

    const jobTemplate = jobsTemplateItems[0];
    const jobsFromGroup = filterJobs(jobs, groupBy, jobGroup);

    const jobElements = jobsFromGroup.map((job: Job | JobWithContent) => {
      const jobItemElement: HTMLDivElement = jobTemplate.element.cloneNode(true) as HTMLDivElement;

      return populateJob(job, jobItemElement, queryParam) as HTMLDivElement;
    });

    for (const templateItem of jobsTemplateItems) {
      templateItem.element.remove();
    }
    jobsList.addItems(jobElements);

    return groupItem;
  });

  for (const templateItem of principalItems) {
    templateItem.element.remove();
  }

  listInstance?.addItems(groupBySections);
}

function filterJobs(jobs: (Job | JobWithContent)[], groupBy: string, value: string) {
  if (groupBy === 'departments') {
    return jobs.filter((job) => {
      if (!job.hasOwnProperty('departments')) {
        return false;
      }
      const jobWithContents = job as JobWithContent;

      const { departments } = jobWithContents;

      return departments.map((deparment) => deparment.name).includes(value);
    });
  }

  return [];
}

function getGroupByKeys(jobs: (Job | JobWithContent)[], groupBy: string) {
  if (groupBy === 'departments') {
    return [
      ...new Set(
        jobs
          .map((job) => (job.hasOwnProperty('departments') && (job as JobWithContent).departments) || '')
          .filter((departments) => departments !== '')
          .map((departments) => departments && departments[0].name)
          .filter(isNotEmpty)
      ),
    ];
  }

  return [];
}
