import type { Job, JobWithContent } from '@finsweet/ts-utils/dist/types/apis/Greenhouse';

import { ATTRIBUTES, queryElement } from '../utils/constants';

export function populateJob(job: Job | JobWithContent, scope: HTMLDivElement | undefined, queryParam: string | null) {
  // link
  const link = queryElement<HTMLLinkElement>(ATTRIBUTES.element.values.link, { scope });

  if (link && queryParam) {
    link.href = `${link.href}?${queryParam}=${job.id}`;
  }

  // title
  const title = queryElement(ATTRIBUTES.element.values.title, { scope });

  if (title) {
    title.textContent = job.title;
  }

  // office and department
  if (job.hasOwnProperty('office') || job.hasOwnProperty('departments') || job.hasOwnProperty('content')) {
    const { offices, departments, content } = job as JobWithContent;

    const office = queryElement(ATTRIBUTES.element.values.office, { scope });
    if (office) {
      office.textContent = offices[0].name || '';
    }

    const department = queryElement(ATTRIBUTES.element.values.department, { scope });
    if (department) {
      department.textContent = departments[0].name || '';
    }

    const description = queryElement<HTMLElement>(ATTRIBUTES.element.values.description, { scope });

    if (description) {
      const unescapedHtml = unescapeHTML(content);
      const descriptionText = unescapedHtml.replace(/class="[-a-zA-Z ]*?"/g, '').replace('<div >', '<div>');
      description.innerHTML = descriptionText;
    }
  }

  const apply = queryElement<HTMLLinkElement>(ATTRIBUTES.element.values.apply, { scope });

  if (apply) {
    apply.href = job.absolute_url;
  }

  return scope;
}

export const unescapeHTML = (rawHTML: string): string => {
  return rawHTML
    .replace(/(&nbsp;)/g, ' ')
    .replace(/(&lt;)/g, '<')
    .replace(/(&gt;)/g, '>')
    .replace(/(&amp;)/g, '&')
    .replace(/(&quot;)/g, '"')
    .replace(/(&#96;)/g, '`')
    .replace(/(&#x27;)/g, "'")
    .replace(/(<br>)/g, '\n');
};
