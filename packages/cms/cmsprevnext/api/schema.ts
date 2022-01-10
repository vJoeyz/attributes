import { CMS_CSS_CLASSES } from '@finsweet/ts-utils';

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
      appliedTo: [`.${CMS_CSS_CLASSES.wrapper}`, `.${CMS_CSS_CLASSES.list}`],
      required: true,
      requiresInstance: false,
    },
    {
      key: PREVIOUS_ELEMENT_KEY,
      description: 'Defines the `Previous` placeholder target.',
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
      appliedTo: ['div'],
      required: true,
      requiresInstance: false,
    },
    {
      key: PREVIOUS_EMPTY_ELEMENT_KEY,
      description: 'Defines the `Previous` Empty State.',
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
      appliedTo: ['div', 'p', 'span', 'button', 'a'],
      required: false,
      requiresInstance: false,
    },
    {
      key: NEXT_ELEMENT_KEY,
      description: 'Defines the `Next` placeholder target.',
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
      appliedTo: ['div'],
      required: true,
      requiresInstance: false,
    },
    {
      key: NEXT_EMPTY_ELEMENT_KEY,
      description: 'Defines the `Next` Empty State.',
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
      appliedTo: ['div', 'p', 'span', 'button', 'a'],
      required: false,
      requiresInstance: false,
    },
  ],
  settings: [],
};
