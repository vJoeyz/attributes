import {
  GREENHOUSE_ATTRIBUTE,
  CMS_LOAD_ATTRIBUTE,
  CMS_FILTER_ATTRIBUTE,
  CMS_SORT_ATTRIBUTE,
} from 'global/constants/attributes';

import { createJobDetails } from './actions/details';
import { createJobListFilter } from './actions/filter';
import { createJobForm } from './actions/form';
import { createJobList } from './actions/jobs';
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
  await Promise.all([
    await window.fsAttributes[CMS_LOAD_ATTRIBUTE]?.loading,
    await window.fsAttributes[CMS_FILTER_ATTRIBUTE]?.loading,
    await window.fsAttributes[CMS_SORT_ATTRIBUTE]?.loading,
  ]);

  queryParam ??= ATTRIBUTES.queryparam.default;

  if (!board) {
    return;
  }

  const listJobsElements = queryElement<HTMLElement>(ATTRIBUTES.element.values.list, { all: true });
  const listJobsForms = queryElement<HTMLFormElement>(ATTRIBUTES.element.values.form, { all: true });
  const filtersElements = queryElement<HTMLElement>(ATTRIBUTES.element.values.filter, { all: true });

  for (const listJobElement of listJobsElements) {
    const listInstances = await createJobList(listJobElement, board, queryParam);

    for (const filterElement of filtersElements) {
      await createJobListFilter(listInstances, filterElement, board);
    }
  }

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
