import { type FsAttributeInit, waitDOMReady } from '@finsweet/attributes-utils';

import FsCookieConsent from './FsCookieConsent';
import { SETTINGS } from './utils';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit<typeof SETTINGS> = async (globalSettings = {}) => {
  // check if url contains debugger
  const IS_STAGING = window?.location?.origin?.includes('webflow.io');
  const url = new URL(window?.location?.href);

  const debug = url.search.includes('debugger') && IS_STAGING;

  // Init library
  const instance = new FsCookieConsent({ ...globalSettings, debug });

  await waitDOMReady();

  return {
    result: instance,
  };
};
