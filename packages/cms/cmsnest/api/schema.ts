import type { AttributeSchema } from '$global/types/schema';

import { LIST_ELEMENT_KEY, COLLECTION_SETTING_KEY, EMPTY_SETTING_KEY } from './../src/utils/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: LIST_ELEMENT_KEY,
      description: 'Defines a list to be combined into the target.',
      conditions: [],
      appliedTo: [],
      required: true,
      requiresInstance: true,
    },
  ],
  settings: [
    {
      key: COLLECTION_SETTING_KEY,
      description: 'Defines a Collection List that will be nested inside the target list element.',
      conditions: [],
      appliedTo: {},
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: EMPTY_SETTING_KEY,
      description: 'Defines an `Empty State` element.',
      conditions: [],
      appliedTo: {},
      value: {
        type: 'string',
        default: '',
      },
    },
  ],
};
