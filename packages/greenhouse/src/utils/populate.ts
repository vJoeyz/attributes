import type { Job, JobWithContent } from '@finsweet/ts-utils/dist/types/apis/Greenhouse';

import { ATTRIBUTES, queryElement } from '../utils/constants';

export function populateJob(job: Job | JobWithContent, scope: HTMLDivElement | undefined, queryParam: string | null) {
  const link = queryElement<HTMLLinkElement>(ATTRIBUTES.element.values.link, { scope });

  if (link && queryParam) {
    link.href = `${link.href}?${queryParam}=${job.id}`;
  }

  const title = queryElement(ATTRIBUTES.element.values.title, { scope });

  if (title) {
    title.textContent = job.title;
  }

  if (job.hasOwnProperty('office') || job.hasOwnProperty('departments')) {
    const { offices, departments } = job as JobWithContent;

    const office = queryElement(ATTRIBUTES.element.values.office, { scope });
    if (office) {
      office.textContent = offices[0].name || '';
    }

    const department = queryElement(ATTRIBUTES.element.values.department, { scope });
    if (department) {
      department.textContent = departments[0].name || '';
    }
  }

  const apply = queryElement<HTMLLinkElement>(ATTRIBUTES.element.values.apply, { scope });

  if (apply) {
    apply.href = job.absolute_url;
  }

  return scope;
}
