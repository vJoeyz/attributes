import type { AttributeSchema } from '$global/types/schema';

import {
  TRIGGER_ON_ELEMENT_KEY,
  TRIGGER_OFF_ELEMENT_KEY,
  TRIGGER_TOGGLE_ELEMENT_KEY,
  FIXED_ELEMENT_KEY,
  TIMEOUT_SETTING_KEY,
} from './../src/utils/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: TRIGGER_ON_ELEMENT_KEY,
      description: 'Defines the trigger that untransforms all parents of the fixed element.',
      required: true,
      requiresInstance: true,
      conditions: [],
      appliedTo: [],
    },
    {
      key: TRIGGER_OFF_ELEMENT_KEY,
      description: 'Defines the trigger that returns the transforms to all parents of the fixed element.',
      required: true,
      requiresInstance: true,
      conditions: [],
      appliedTo: [],
    },
    {
      key: TRIGGER_TOGGLE_ELEMENT_KEY,
      description: 'Defines a trigger that toggles `on/off` the untransforms.',
      required: true,
      requiresInstance: true,
      conditions: [],
      appliedTo: [],
    },
    {
      key: FIXED_ELEMENT_KEY,
      description: 'Defines the element that has `position: fixed`.',
      required: true,
      requiresInstance: true,
      conditions: [
        {
          type: 'isParentOf',
          element: TRIGGER_ON_ELEMENT_KEY,
        },
      ],
      appliedTo: [],
    },
  ],
  settings: [
    {
      key: TIMEOUT_SETTING_KEY,
      description: 'Defines the timeout to wait before triggering the `off` state.',
      conditions: [],
      appliedTo: {},
      value: {
        type: 'int',
        default: '0',
      },
    },
  ],
};
