import type { AttributeSchema } from '$global/types/schema';

import {
  WRAPPER_ELEMENT_KEY,
  TRACK_ELEMENT_KEY,
  FILL_ELEMENT_KEY,
  HANDLE_ELEMENT_KEY,
  DISPLAY_VALUE_ELEMENT_KEY,
  MIN_SETTING_KEY,
  MAX_SETTING_KEY,
  START_SETTING_KEY,
  STEP_SETTING_KEY,
  FORMAT_DISPLAY_SETTING_KEY,
  UPDATE_ACTION_SETTING_KEY,
} from './../src/utils/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: WRAPPER_ELEMENT_KEY,
      description: 'Defines a range slider instance element.',
      appliedTo: [],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
    {
      key: TRACK_ELEMENT_KEY,
      description: 'Defines the track of the slider.',
      appliedTo: [],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
    {
      key: FILL_ELEMENT_KEY,
      description: 'Defines the fill of the slider.',
      appliedTo: [],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
    {
      key: HANDLE_ELEMENT_KEY,
      description: 'Defines a handle of the slider.',
      appliedTo: [],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
    {
      key: DISPLAY_VALUE_ELEMENT_KEY,
      description: "Defines an element to display a Handle's value.",
      appliedTo: [],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
  ],
  settings: [
    {
      key: MIN_SETTING_KEY,
      description: 'Defines the minimum value of the range.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'int',
        default: '0',
      },
    },
    {
      key: MAX_SETTING_KEY,
      description: 'Defines the maximum value of the range.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'int',
        default: '0',
      },
    },
    {
      key: START_SETTING_KEY,
      description: 'Defines the start value of a handle.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'int',
        default: '0',
      },
    },
    {
      key: STEP_SETTING_KEY,
      description: 'Defines the step of the values.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'int',
        default: '0',
      },
    },
    {
      key: FORMAT_DISPLAY_SETTING_KEY,
      description: "Defines if the Handles' value display should be formatted.",
      appliedTo: {},
      conditions: [],
      value: {
        type: 'boolean',
        default: 'true',
      },
    },
    {
      key: UPDATE_ACTION_SETTING_KEY,
      description: 'Defines when should the <input> elements be updated.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'options',
        default: 'move',
        options: [
          {
            value: 'move',
            description:
              'The value of the range slider <input> will be updated on every single move of the handle. As the user moves the handle, the <input> constantly updates.',
          },
          {
            value: 'release',
            description:
              'The value of the range slider <input> will be updated when the user releases the mouse/finger from the handle.',
          },
        ],
      },
    },
  ],
};
