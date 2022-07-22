import { generateSelectors } from '@global/factory';

export const ATTRIBUTE = 'queryparam';

const ATTRIBUTES_PREFIX = `fs-${ATTRIBUTE}`;

export const NAME_SETTING_KEY = 'name';
export const REMOVE_QUERY_SETTING_KEY = 'removequery';
export const REMOVE_QUERY_SETTING_VALUES = { true: 'true' } as const;

export const ATTRIBUTES = {
  name: {
    key: `${ATTRIBUTES_PREFIX}-${NAME_SETTING_KEY}`,
  },
  removequery: {
    key: `${ATTRIBUTES_PREFIX}-${REMOVE_QUERY_SETTING_KEY}`,
    values: REMOVE_QUERY_SETTING_VALUES,
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
