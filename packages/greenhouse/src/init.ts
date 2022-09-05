import type { FormField } from '@finsweet/ts-utils';
import { GREENHOUSE_ATTRIBUTE, CMS_LOAD_ATTRIBUTE, CMS_FILTER_ATTRIBUTE } from 'global/constants/attributes';
import type { CMSList } from 'packages/cmscore/src';
import type { CMSFilters } from 'packages/cmsfilter/src/components/CMSFilters';

import { createJobDetails } from './actions/details';
import { createFilters } from './actions/filter';
import { createJobForm } from './actions/form';
import { createJobList, addJobsToList } from './actions/jobs';
import { ATTRIBUTES, GH_DEPARTMENT, GH_OFFICE, queryElement } from './utils/constants';
import { fetchJobs } from './utils/fetch';

/**
 * Inits the attribute.
 */
export const init = async ({
  board,
  queryParam,
}: {
  board: string | null;
  queryParam?: string | null;
}): Promise<void> => {
  // init params
  queryParam ??= ATTRIBUTES.queryparam.default;

  if (!board) {
    return;
  }

  const url = new URL(window.location.href);

  const jobId = url.searchParams.get(queryParam);
  const office = url.searchParams.get(GH_OFFICE);
  const department = url.searchParams.get(GH_DEPARTMENT);

  const jobs = await fetchJobs(board, { office, department });

  const cmsLoadLists: CMSList[] = await window.fsAttributes[CMS_LOAD_ATTRIBUTE]?.loading;

  const cmsFilterLists: CMSFilters[] = await window.fsAttributes[CMS_FILTER_ATTRIBUTE]?.loading;

  const listJobsElement = queryElement<HTMLElement>(ATTRIBUTES.element.values.list);

  if (listJobsElement) {
    const cmsLoadList = cmsLoadLists && cmsLoadLists.find((listInstance) => listInstance.wrapper === listJobsElement);
    if (cmsLoadList) {
      addJobsToList(cmsLoadList, queryParam, jobs);
    } else {
      createJobList(listJobsElement, queryParam, jobs);
    }
  }

  // filters
  const filtersElements = document.querySelectorAll<FormField>(`[${ATTRIBUTES.filter.key}]`);

  if (cmsFilterLists && filtersElements.length > 0) {
    await createFilters(board, queryParam, cmsFilterLists, [...filtersElements], jobs);
  }

  // jobs
  const listJobsForms = queryElement<HTMLFormElement>(ATTRIBUTES.element.values.form, { all: true });

  if (jobId) {
    createJobDetails(jobId, board);

    for (const listJobForm of listJobsForms) {
      createJobForm(listJobForm, jobId, board);
    }
  }

  window.fsAttributes[GREENHOUSE_ATTRIBUTE].resolve?.(undefined);
};
