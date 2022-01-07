import type { AttributeSchema } from '$global/types/schema';

import {
  LIST_ELEMENT_KEY,
  PREVIOUS_ELEMENT_KEY,
  PREVIOUS_EMPTY_ELEMENT_KEY,
  NEXT_ELEMENT_KEY,
  NEXT_EMPTY_ELEMENT_KEY,
} from './../src/constants';

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
    {
      key: PREVIOUS_ELEMENT_KEY,
      description: 'Defines the `Previous` placeholder target.',
      conditions: [],
      appliedTo: [],
      required: true,
      requiresInstance: true,
    },
    {
      key: PREVIOUS_EMPTY_ELEMENT_KEY,
      description: 'Defines the `Previous` Empty State.',
      conditions: [],
      appliedTo: [],
      required: true,
      requiresInstance: true,
    },
    {
      key: NEXT_ELEMENT_KEY,
      description: 'Defines the `Next` placeholder target.',
      conditions: [],
      appliedTo: [],
      required: true,
      requiresInstance: true,
    },
    {
      key: NEXT_EMPTY_ELEMENT_KEY,
      description: 'Defines the `Next` Empty State.',
      conditions: [],
      appliedTo: [],
      required: true,
      requiresInstance: true,
    },
  ],
  settings: [],
};
