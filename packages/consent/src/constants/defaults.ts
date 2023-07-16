import type { Consents } from '../types';

// Defaults
export const CONSENT_REQUIRED: Consents = Object.freeze({
  analytics: false,
  essential: true,
  marketing: false,
  personalization: false,
  uncategorized: false,
} as const);

export const CONSENT_ALL: Consents = Object.freeze({
  analytics: true,
  essential: true,
  marketing: true,
  personalization: true,
  uncategorized: true,
} as const);

export const DEFAULT_COOKIE_MAX_AGE = '180';
