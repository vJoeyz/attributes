import type { AttributeSchema } from '$global/types/schema';

import {
  LIST_ELEMENT_KEY,
  TRIGGER_ELEMENT_KEY,
  DROPDOWN_LABEL_ELEMENT_KEY,
  SCROLL_ANCHOR_ELEMENT_KEY,
  FIELD_SETTING_KEY,
  TYPE_SETTING_KEY,
  EASING_SETTING_KEY,
  DURATION_SETTING_KEY,
  ASC_CLASS_SETTING_KEY,
  DESC_CLASS_SETTING_KEY,
  REVERSE_SETTING_KEY,
} from './../src/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: LIST_ELEMENT_KEY,
      description: 'Defines a list to be combined into the target.',
      appliedTo: [],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
    {
      key: TRIGGER_ELEMENT_KEY,
      description: 'Defines the `Previous` placeholder target.',
      appliedTo: [],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
    {
      key: DROPDOWN_LABEL_ELEMENT_KEY,
      description: 'Defines a Dropdown label.',
      appliedTo: [],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
    {
      key: SCROLL_ANCHOR_ELEMENT_KEY,
      description: 'Defines an element where to scroll the view every time a filter is applied.',
      appliedTo: [],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
  ],
  settings: [
    {
      key: FIELD_SETTING_KEY,
      description: 'Defines a field key to sort items.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: TYPE_SETTING_KEY,
      description: 'Defines the type of the values to sort.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: EASING_SETTING_KEY,
      description: 'Defines the easing function of the list animation.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: DURATION_SETTING_KEY,
      description: 'Defines the duration of the list animation.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: ASC_CLASS_SETTING_KEY,
      description: 'Defines the CSS Class for the `asc` state.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: DESC_CLASS_SETTING_KEY,
      description: 'Defines the CSS Class for the `desc` state.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: REVERSE_SETTING_KEY,
      description: 'Defines if a button should trigger `desc` sorting on first click.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'boolean',
        default: 'true',
      },
    },
  ],
};
