import { GREENHOUSE_ATTRIBUTE, CMS_LOAD_ATTRIBUTE, CMS_FILTER_ATTRIBUTE } from 'global/constants/attributes';
import type { CMSList } from 'packages/cmscore/src';
import type { CMSFilters } from 'packages/cmsfilter/src/components/CMSFilters';

import { createJobDetails } from './actions/details';
import { createFilters } from './actions/filter';
import { createJobForm } from './actions/form';
import { createJobList, addJobsToList } from './actions/jobs';
import { ATTRIBUTES, queryElement } from './utils/constants';

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

  const cmsLoadLists: CMSList[] = await window.fsAttributes[CMS_LOAD_ATTRIBUTE]?.loading;

  const cmsFilterLists: CMSFilters[] = await window.fsAttributes[CMS_FILTER_ATTRIBUTE]?.loading;

  const listJobsElements = queryElement<HTMLElement>(ATTRIBUTES.element.values.list, { all: true });

  for (const listJobsElement of listJobsElements) {
    const cmsLoadList = cmsLoadLists && cmsLoadLists.find((listInstance) => listInstance.wrapper === listJobsElement);

    if (cmsLoadList) {
      addJobsToList(cmsLoadList, board, queryParam);
      continue;
    }

    createJobList(listJobsElement, board, queryParam);
  }

  const filtersElements = queryElement<HTMLInputElement | HTMLSelectElement>(ATTRIBUTES.element.values.filter, {
    all: true,
  });

  // const cmsFilterLists: CMSList[] = await window.fsAttributes[CMS_FILTER_ATTRIBUTE]?.loading;

  if (cmsFilterLists && filtersElements.length > 0) {
    await createFilters(board, queryParam, cmsFilterLists, [...filtersElements]);
  }

  const listJobsForms = queryElement<HTMLFormElement>(ATTRIBUTES.element.values.form, { all: true });

  const url = new URL(window.location.href);

  const jobId = url.searchParams.get(queryParam);

  if (jobId) {
    createJobDetails(jobId, board);

    for (const listJobForm of listJobsForms) {
      createJobForm(listJobForm, jobId, board);
    }
  }

  // console.log(board, queryParam);
  window.fsAttributes[GREENHOUSE_ATTRIBUTE].resolve?.(undefined);
};
