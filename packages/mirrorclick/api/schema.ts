import type { AttributeSchema } from '$global/types/schema';

import { TRIGGER_ELEMENT_KEY, TARGET_ELEMENT_KEY, DELAY_SETTING_KEY } from '../src/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: TRIGGER_ELEMENT_KEY,
      description: ' Defines the element as the trigger of the event.',
      appliedTo: [],
      conditions: [],
      requiresInstance: true,
      required: true,
    },
    {
      key: TARGET_ELEMENT_KEY,
      description: 'Defines the element as the target to mirror the fired event.',
      appliedTo: [],
      conditions: [],
      requiresInstance: true,
      required: true,
    },
  ],
  settings: [
    {
      key: DELAY_SETTING_KEY,
      description: 'Defines a delay to wait until the click event is replicated on the target.',
      appliedTo: {
        elements: [TRIGGER_ELEMENT_KEY, TARGET_ELEMENT_KEY],
      },
      conditions: [
        {
          type: 'exists',
          element: TRIGGER_ELEMENT_KEY,
        },
        {
          type: 'exists',
          element: TARGET_ELEMENT_KEY,
        },
      ],
      value: {
        type: 'int',
        default: '0',
      },
    },
  ],
};
