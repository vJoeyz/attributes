import { type FsAttributeInit, waitDOMReady } from '@finsweet/attributes-utils';

import FsCookieConsent from './FsCookieConsent';
import type { FsCookieConsentCallback } from './types';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  // Collect callbacks, if any

  // Init library
  const instance = new FsCookieConsent();

  await waitDOMReady();

  return {
    result: instance,
  };
};
