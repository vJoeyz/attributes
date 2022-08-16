import { CMSItem, CMSList, createCMSListInstance } from '@finsweet/attributes-cmscore';
import { importCMSCore } from '@finsweet/attributes-cmscore';
import { isNotEmpty } from '@finsweet/ts-utils';
import type { JobsResponse, Job, JobWithContent } from '@finsweet/ts-utils/dist/types/apis/Greenhouse';

import { ATTRIBUTES, getSelector, GH_API_BASE, GH_API_JOBS } from '../utils/constants';
import { populateJob } from '../utils/populate';

export async function createJobList(listWrapper: HTMLElement, boardId: string, queryParam: string) {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  const jobsRequest = await fetch(`${GH_API_BASE}/${boardId}/${GH_API_JOBS}?content=true`);

  const jobsResponse: JobsResponse = await jobsRequest.json();

  const { jobs } = jobsResponse;

  // Create the list instances
  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  listInstances.forEach((listInstance) => {
    const { wrapper } = listInstance;

    const groupBy = wrapper.getAttribute(ATTRIBUTES.groupBy.key);
    const nestedWrapper = wrapper.querySelector<HTMLElement>('.w-dyn-list');

    if (!groupBy || !nestedWrapper) {
      createJobsDefaultList(listInstance, jobs, queryParam);
      return;
    }

    createJobsNestedList(listInstance, jobs, queryParam, groupBy, nestedWrapper);
  });
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

  for (const templateItem of templateItems) {
    templateItem.element.remove();
  }
  listInstance.addItems(jobElements);
}

function createJobsNestedList(
  listInstance: CMSList,
  jobs: (Job | JobWithContent)[],
  queryParam: string,
  groupBy: string,
  nestedWrapper: HTMLElement
) {
  const principalItems = [...listInstance.items];

  const groupByTemplate: CMSItem = principalItems[0];

  const nestedList = createCMSListInstance(nestedWrapper);

  if (!nestedList) {
    return null;
  }

  const templateItems = [...nestedList.items];

  const template: CMSItem = templateItems[0];

  const jobsGroups: string[] = getGroupByKeys(jobs, groupBy);

  for (const jobGroup of jobsGroups) {
    console.log(jobGroup);

    const jobsFromGroup = filterJobs(jobs, groupBy, jobGroup);

    const jobElements = jobsFromGroup.map((job: Job | JobWithContent) => {
      const jobItemElement: HTMLDivElement = template.element.cloneNode(true) as HTMLDivElement;

      return populateJob(job, jobItemElement, queryParam) as HTMLDivElement;
    });

    nestedList.addItems(jobElements);

    console.log(jobElements);
  }
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
