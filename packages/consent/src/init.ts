import { type FsAttributeInit } from '@finsweet/attributes-utils';

import FsCookieConsent from './FsCookieConsent';
import type { FsCookieConsentCallback } from './types';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  // Collect callbacks, if any
  const callbacks = (Array.isArray(window.FsCC) ? window.FsCC : []) as FsCookieConsentCallback[];

  // Init library
  const instance = new FsCookieConsent(callbacks);

  return {
    result: instance,
  };
};
