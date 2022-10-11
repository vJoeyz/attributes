import { LAUNCHDARKLY_ATTRIBUTE } from '$global/constants/attributes';
import { generateSelectors } from '$global/factory';

const ATTRIBUTES_PREFIX = `fs-${LAUNCHDARKLY_ATTRIBUTE}`;

export const DEV_CLIENT_ID = `devclientid`;
export const PROD_CLIENT_ID = `prodclientid`;
export const EVENTS_TO_TRACK = `eventstotrack`;
export const FLAG = `flag`;
export const SHOW_IF = `showif`;
export const SET_PROPERTIES = `setproperties`;

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {},
  },

  /**
   * Defines clientId for the LaunchDarkly environment.
   */
  devClientId: {
    key: `${ATTRIBUTES_PREFIX}-${DEV_CLIENT_ID}`,
  },

  prodClientId: {
    key: `${ATTRIBUTES_PREFIX}-${PROD_CLIENT_ID}`,
  },

  eventsToTrack: {
    key: `${ATTRIBUTES_PREFIX}-${EVENTS_TO_TRACK}`,
  },

  flag: {
    key: `${ATTRIBUTES_PREFIX}-${FLAG}`,
  },

  showIf: {
    key: `${ATTRIBUTES_PREFIX}-${SHOW_IF}`,
  },

  setProperties: {
    key: `${ATTRIBUTES_PREFIX}-${SET_PROPERTIES}`,
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);

export const TEXT_PROPERTY = `text`;
export const SRC_PROPERTY = `src`;
export const SRCSET_PROPERTY = `srcset`;
export const SIZES_PROPERTY = `sizes`;
export const JSON_PROPERTY = `json`;
