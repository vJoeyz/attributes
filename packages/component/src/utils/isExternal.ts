import { isAbsoluteURL } from './isAbsoluteURL';
import { isSameWebflowProject } from './isSameWebflowProject';

export const isExternalURL = async (url: string) => {
  if (isAbsoluteURL(url) && (await isSameWebflowProject(window.location.origin, url)) === false) {
    return true;
  }
  return false;
};
