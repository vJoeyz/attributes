import { LAUNCHDARKLY_ATTRIBUTE } from '$global/constants/attributes';
import { generateSelectors } from '$global/factory';

const ATTRIBUTES_PREFIX = `fs-${LAUNCHDARKLY_ATTRIBUTE}`;

export const DEV_CLIENT_ID = `devclientid`;
export const PROD_CLIENT_ID = `prodclientid`;
export const EVENTS_TO_TRACK = `eventstotrack`;
export const FLAG = `flag`;
export const SHOW_IF = `showif`;
export const SET_PROPERTY = `setproperty`;
export const SET_PROPERTIES = `setproperties`;
export const TEXT_ATTRIBUTE = `text`;
export const SRC_ATTRIBUTE = `src`;
export const SRCSET_ATTRIBUTE = `srcset`;
export const SIZES_ATTRIBUTE = `sizes`;
export const JSON_ATTRIBUTE = `json`;

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
  setProperty: {
    key: `${ATTRIBUTES_PREFIX}-${SET_PROPERTY}`,
  },
  setProperties: {
    key: `${ATTRIBUTES_PREFIX}-${SET_PROPERTIES}`,
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
