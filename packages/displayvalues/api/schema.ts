import type { AttributeSchema } from '$global/types/schema';

import { SOURCE_ELEMENT_KEY, TARGET_ELEMENT_KEY, PLACEHOLDER_SETTING_KEY } from './../src/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: SOURCE_ELEMENT_KEY,
      description: 'Defines the element as the source of the event.',
      conditions: [],
      appliedTo: ['input', 'select', 'textarea'],
      requiresInstance: true,
      required: true,
    },
    {
      key: TARGET_ELEMENT_KEY,
      description: 'Defines the element as the target to display the source value.',
      conditions: [
        {
          type: 'exists',
          element: SOURCE_ELEMENT_KEY,
        },
      ],
      appliedTo: [],
      requiresInstance: true,
      required: true,
    },
  ],
  settings: [
    {
      key: PLACEHOLDER_SETTING_KEY,
      description: 'Defines a placeholder text to display when no value exists.',
      appliedTo: {
        elements: [TARGET_ELEMENT_KEY],
      },
      conditions: [
        {
          type: 'exists',
          element: SOURCE_ELEMENT_KEY,
        },
      ],
      value: {
        type: 'string',
      },
    },
  ],
};
