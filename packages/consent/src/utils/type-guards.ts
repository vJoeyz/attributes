import { isKeyOf } from '@finsweet/attributes-utils';

import { CONSENTS } from '../constants';
import { type Consents } from '../types';

/**
 * Check if a consents object is valid
 * @param consents
 * @returns True/false
 */
// prettier-ignore
// eslint-disable-next-line
export const validConsents = (consents: any): consents is Partial<Consents> => Object.keys(consents).every((key) => isKeyOf(key, CONSENTS));
