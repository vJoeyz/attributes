import type { CMSList } from '@finsweet/attributes-cmscore';
import { importCMSCore } from '@finsweet/attributes-cmscore';
import {
  CMS_GREENHOUSE_ATTRIBUTE,
  CMS_LOAD_ATTRIBUTE,
  CMS_FILTER_ATTRIBUTE,
  CMS_SORT_ATTRIBUTE,
} from 'global/constants/attributes';

import { createJobDetails } from './actions/details';
import { createJobForm } from './actions/form';
import { createJobList } from './actions/jobs';
import { ATTRIBUTES, queryElement } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<void> => {
  await Promise.all([
    await window.fsAttributes[CMS_LOAD_ATTRIBUTE]?.loading,
    await window.fsAttributes[CMS_FILTER_ATTRIBUTE]?.loading,
    await window.fsAttributes[CMS_SORT_ATTRIBUTE]?.loading,
  ]);

  const { currentScript } = window as any as { currentScript: HTMLScriptElement };

  const board = currentScript.getAttribute(ATTRIBUTES.board.key);

  if (!board) {
    return;
  }

  const queryParam = currentScript.getAttribute(ATTRIBUTES.queryparam.key) || ATTRIBUTES.queryparam.default;

  const listJobsElements = queryElement<HTMLElement>(ATTRIBUTES.element.values.list, { all: true });
  const listJobsForms = queryElement<HTMLFormElement>(ATTRIBUTES.element.values.form, { all: true });

  for (const listJobElement of listJobsElements) {
    createJobList(listJobElement, board, queryParam);
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
  window.fsAttributes[CMS_GREENHOUSE_ATTRIBUTE].resolve?.(undefined);
};
