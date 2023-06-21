import { unescapeHTML } from '@finsweet/attributes-utils';

import type { Job, JobWithContent } from '../types';
import { queryAllElements } from './selectors';

export function populateJob(job: Job | JobWithContent, scope: HTMLDivElement | undefined, queryParam: string | null) {
  // link
  if (queryParam) {
    const linkElements = queryAllElements<HTMLLinkElement>('link', { scope });

    for (const linkElement of linkElements) {
      const url = new URL(linkElement.href);
      url.searchParams.set(queryParam, job.id.toString());
      linkElement.href = url.toString();
    }
  }

  // title
  const titleElements = queryAllElements('title', { scope });

  for (const titleElement of titleElements) {
    titleElement.textContent = job.title;
  }

  // office and department
  if (job.hasOwnProperty('office') || job.hasOwnProperty('departments') || job.hasOwnProperty('content')) {
    const { offices, departments, content } = job as JobWithContent;

    // offices
    if (offices[0] && offices[0].name) {
      const officeElements = queryAllElements('office', { scope });

      officeElements.forEach((office) => {
        office.textContent = offices[0].name || '';
      });
    }

    // departments
    if (departments[0] && departments[0].name) {
      const departmentElements = queryAllElements('department', { scope });

      departmentElements.forEach((department) => {
        department.textContent = departments[0].name || '';
      });
    }

    // description
    const descriptionElements = queryAllElements('description', { scope });

    descriptionElements.forEach((description) => {
      const unescapedHtml = unescapeHTML(content);
      const descriptionText = unescapedHtml.replace(/class="[-a-zA-Z ]*?"/g, '').replace('<div >', '<div>');
      description.innerHTML = descriptionText;
    });
  }

  // apply elements
  const applyElements = queryAllElements<HTMLLinkElement>('apply', { scope });

  for (const applyElement of applyElements) {
    applyElement.href = job.absolute_url;
  }

  return scope;
}
