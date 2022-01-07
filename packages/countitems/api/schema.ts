import type { AttributeSchema } from '$global/types/schema';

import { LIST_ELEMENT_KEY, VALUE_ELEMENT_KEY } from './../src/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: LIST_ELEMENT_KEY,
      description: 'Defines the CMS list or list-wrapper.',
      required: true,
      requiresInstance: true,
      appliedTo: [],
      conditions: [],
    },
    {
      key: VALUE_ELEMENT_KEY,
      description: 'Defines the element that will display the amount of CMS items.',
      required: true,
      requiresInstance: true,
      appliedTo: [],
      conditions: [],
    },
  ],
  settings: [],
};
