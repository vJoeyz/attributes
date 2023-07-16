import type { ConsentKey } from '../types';
import { getElementSelector, getSettingSelector, removeSquaredBrackets } from '../utils';

/**
 * Consents
 */
const REQUIRED_CONSENTS = ['essential'] as const;
export const OPTIONAL_CONSENTS = ['personalization', 'analytics', 'marketing'] as const;
export const UNCATEGORIZED_CONSENT = 'uncategorized';
export const CONSENTS = [...REQUIRED_CONSENTS, ...OPTIONAL_CONSENTS, UNCATEGORIZED_CONSENT] as const;

/**
 * Main Key
 */
export const MAIN_KEY = 'fs-consent';
export const IE_KEY = MAIN_KEY + '-ie';

/**
 * Modes
 */
export const MODES = ['informational', 'opt-in', 'opt-out'] as const;

/**
 * Actions
 */
export const ACTIONS = {
  allow: 'allow',
  deny: 'deny',
  submit: 'submit',
} as const;

/**
 * Attributes
 */
export const ATTRIBUTES = {
  categories: [
    removeSquaredBrackets(getSettingSelector('categories')),
    removeSquaredBrackets(getSettingSelector('category')),
  ],
  disableScroll: removeSquaredBrackets(getSettingSelector('scroll')),
  displayProperty: removeSquaredBrackets(getSettingSelector('display')),
  cookieMaxAge: removeSquaredBrackets(getSettingSelector('expires')),
  mode: removeSquaredBrackets(getSettingSelector('mode')),
  debugMode: removeSquaredBrackets(getSettingSelector('debug')),
  endpoint: removeSquaredBrackets(getSettingSelector('endpoint')),
  componentsSource: removeSquaredBrackets(getSettingSelector('source')),
  src: removeSquaredBrackets(getSettingSelector('src')),
  placeholder: removeSquaredBrackets(getSettingSelector('placeholder')),
  domain: removeSquaredBrackets(getSettingSelector('domain')),
} as const;

/**
 * Cookie Keys
 */
export const COOKIE_KEYS = {
  main: MAIN_KEY,
  consentsUpdated: `${MAIN_KEY}-updated`,
};

/**
 * CSS Classes
 */
export const WEBFLOW_CSS = {
  customCheckbox: 'w-checkbox-input--inputType-custom',
  customRadio: 'w-form-formradioinput--inputType-custom',
  checkedInput: 'w--redirected-checked',
};

/**
 * Dynamic Keys
 */
export const DYNAMIC_KEYS = {
  checkbox: (key: ConsentKey): string => `[${MAIN_KEY}-checkbox="${key}"]`,
  gtmEvent: (key: ConsentKey): string => `${key}-activated`,
};

/**
 * Google Tag Manager
 */
export const GTM_EVENT_SUFFIX = '-activated';

/**
 * Style tag to prevent components to be displayed
 */
export const FS_CONSENT_CSS = /* html */ `<style>${getElementSelector('banner')},${getElementSelector(
  'fixed-preferences'
)},${getElementSelector('preferences')},${getElementSelector('interaction')}{display:none}</style>`;

export * from './defaults';
