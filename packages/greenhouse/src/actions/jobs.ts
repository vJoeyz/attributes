import type { CMSItem } from '@finsweet/attributes-cmscore';
import { importCMSCore } from '@finsweet/attributes-cmscore';
import type { JobsResponse, Job, JobWithContent } from '@finsweet/ts-utils/dist/types/apis/Greenhouse';

import { getSelector, GH_API_BASE, GH_API_JOBS } from '../utils/constants';
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
  });
}
