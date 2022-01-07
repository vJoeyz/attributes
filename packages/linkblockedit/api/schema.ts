import type { AttributeSchema } from '$global/types/schema';

import { PARENT_ELEMENT_KEY, SELECTOR_SETTING_KEY } from '../src/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: PARENT_ELEMENT_KEY,
      description: 'Defines the parent element that will act as the `Link Block`.',
      required: true,
      requiresInstance: false,
      appliedTo: [],
      conditions: [],
    },
  ],
  settings: [
    {
      key: SELECTOR_SETTING_KEY,
      description: 'Defines a global selector to query multiple `parent` elements.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
  ],
};
