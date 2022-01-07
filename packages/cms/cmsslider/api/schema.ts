import type { AttributeSchema } from '$global/types/schema';

import { LIST_ELEMENT_KEY, SLIDER_ELEMENT_KEY } from './../src/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: LIST_ELEMENT_KEY,
      description: 'Defines a list to be included into the target slider.',
      appliedTo: [],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
    {
      key: SLIDER_ELEMENT_KEY,
      description: 'Defines the target slider where all lists will be included into.',
      appliedTo: [],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
  ],
  settings: [],
};
