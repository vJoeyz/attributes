import { isKeyOf } from '@finsweet/attributes-utils';

import { type Consents } from '../types';
import { CONSENTS } from '../utils';

/**
 * Check if a consents object is valid
 * @param consents
 * @returns True/false
 */
export const isValidConsents = (consents: any): consents is Partial<Consents> =>
  Object.keys(consents).every((key) => isKeyOf(key, CONSENTS));
