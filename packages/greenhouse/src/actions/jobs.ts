import { CMSItem, CMSList } from '@finsweet/attributes-cmscore';
import { importCMSCore } from '@finsweet/attributes-cmscore';
import { isNotEmpty } from '@finsweet/ts-utils';
import { CMS_CSS_CLASSES } from '@finsweet/ts-utils';
import type { Job, JobWithContent } from '@finsweet/ts-utils/dist/types/apis/Greenhouse';

import { fetchJobs } from '../utils/fetch';
import { populateJob } from '../utils/populate';

export async function createJobList(listWrapper: HTMLElement, boardId: string, queryParam: string) {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  // Create the list instances
  const listInstance = cmsCore.createCMSListInstance(listWrapper);

  if (!listInstance) {
    return;
  }

  await addJobsToList(listInstance, boardId, queryParam);
}

const SUPPORTED_NESTED_KEYS = ['department', 'office'];

export async function addJobsToList(listInstance: CMSList, boardId: string, queryParam: string) {
  const jobs = await fetchJobs(boardId);

  const templateItem = [...listInstance.items][0];

  const { element } = templateItem;

  const nestedList = element.querySelector(`.${CMS_CSS_CLASSES.wrapper}`);

  if (nestedList) {
    const groupByKeys: string[] = [...element.querySelectorAll<HTMLElement>(`[fs-greenhouse-element]`)]
      .map((element) => {
        const elementAttribute = element.getAttribute('fs-greenhouse-element');

        if (!elementAttribute) {
          return null;
        }

        return (
          (nestedList.contains(element) === false &&
            SUPPORTED_NESTED_KEYS.includes(elementAttribute) &&
            elementAttribute) ||
          null
        );
      })
      //.filter((value) => value !== null)
      .filter(isNotEmpty);
    createJobsNestedList(listInstance, jobs, queryParam, groupByKeys);
    return;
  }

  createJobsDefaultList(listInstance, jobs, queryParam);
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
  groupByKeys: string[]
) {
  const groupBy = groupByKeys[0];
  const mainItems = [...listInstance.items];

  const mainTemplate: CMSItem = mainItems[0];

  const jobsGroups: string[] = getGroupByKeys(jobs, groupBy);

  const groupBySections: HTMLDivElement[] = jobsGroups.map((jobGroup) => {
    const mainItem: HTMLDivElement = mainTemplate.element.cloneNode(true) as HTMLDivElement;

    const groupByLabel = mainItem.querySelector<HTMLElement>(`[fs-greenhouse-element="${groupBy}"]`);

    if (groupByLabel) {
      groupByLabel.textContent = jobGroup;
    }

    const jobsWrapper = mainItem.querySelector<HTMLDivElement>('.w-dyn-list');

    if (!jobsWrapper) {
      return mainItem;
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

    return mainItem;
  });

  listInstance.clearItems(true);

  listInstance?.addItems(groupBySections);
}

function filterJobs(jobs: (Job | JobWithContent)[], groupBy: string, value: string) {
  if (groupBy === 'department') {
    return jobs.filter((job) => {
      if (!job.hasOwnProperty('departments')) {
        return false;
      }
      const jobWithContents = job as JobWithContent;

      const { departments } = jobWithContents;

      return departments.map((deparment) => deparment.name).includes(value);
    });
  }

  if (groupBy === 'office') {
    return jobs.filter((job) => {
      if (!job.hasOwnProperty('offices')) {
        return false;
      }
      const jobWithContents = job as JobWithContent;

      const { offices } = jobWithContents;

      return offices.map((office) => office.name).includes(value);
    });
  }

  return [];
}

function getGroupByKeys(jobs: (Job | JobWithContent)[], groupBy: string) {
  if (groupBy === 'department') {
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

  if (groupBy === 'office') {
    return [
      ...new Set(
        jobs
          .map((job) => (job.hasOwnProperty('offices') && (job as JobWithContent).offices) || '')
          .filter((offices) => offices !== '')
          .map((offices) => offices && offices[0].name)
          .filter(isNotEmpty)
      ),
    ];
  }

  return [];
}
