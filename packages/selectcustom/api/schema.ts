import type { AttributeSchema } from '$global/types/schema';

import {
  DROPDOWN_ELEMENT_KEY,
  LABEL_ELEMENT_KEY,
  RESET_OPTION_KEY,
  HIDE_INITIAL_SETTING_KEY,
} from './../src/utils/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: DROPDOWN_ELEMENT_KEY,
      description: 'Defines a dropdown element.',
      required: true,
      requiresInstance: true,
      appliedTo: ['.w-dropdown'],
      conditions: [],
    },
    {
      key: LABEL_ELEMENT_KEY,
      description: 'Defines the label that displays the currently selected option.',
      required: false,
      requiresInstance: true,
      appliedTo: ['div'],
      conditions: [
        {
          type: 'isChildOf',
          element: DROPDOWN_ELEMENT_KEY,
        },
      ],
    },
    {
      key: RESET_OPTION_KEY,
      description: 'Defines an option that will remove the selected value.',
      required: true,
      requiresInstance: true,
      appliedTo: ['w-dropdown a'],
      conditions: [
        {
          type: 'exists',
          element: DROPDOWN_ELEMENT_KEY,
        },
      ],
    },
  ],
  settings: [
    {
      key: HIDE_INITIAL_SETTING_KEY,
      description: "Defines if the reset option should be hidden whenever there isn't an active selection.",
      appliedTo: {
        elements: [DROPDOWN_ELEMENT_KEY],
      },
      conditions: [],
      value: {
        type: 'boolean',
        default: 'true',
      },
    },
  ],
};
