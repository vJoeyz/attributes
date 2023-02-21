import { getSiteId } from '@finsweet/ts-utils';

/**
 * Checks if an external page is from the same Webflow project.
 * @param page
 * @returns True if the page is from the same Webflow project, false otherwise.
 */
export const isSameWebflowProject = async (page: Document) => {
  const currentPageSiteId = getSiteId();
  const fetchedPageSiteId = getSiteId(page);

  if (!currentPageSiteId || !fetchedPageSiteId) return false;

  return currentPageSiteId === fetchedPageSiteId;
};
