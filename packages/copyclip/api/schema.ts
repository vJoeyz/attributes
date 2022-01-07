import type { AttributeSchema } from '$global/types/schema';

import {
  TRIGGER_ELEMENT_KEY,
  TARGET_ELEMENT_KEY,
  SIBLING_ELEMENT_KEY,
  TEXT_SETTING_KEY,
  SUCCESS_MESSAGE_SETTING_KEY,
  SUCESSS_DURATION_SETTING_KEY,
  SUCESSS_CLASS_SETTING_KEY,
  SELECTOR_SETTING_KEY,
} from './../src/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: TRIGGER_ELEMENT_KEY,
      description: 'Defines an element to act as the copy trigger.',
      required: true,
      requiresInstance: true,
      appliedTo: [],
      conditions: [],
    },
    {
      key: TARGET_ELEMENT_KEY,
      description: 'Defines an element to act as the copy target.',
      required: true,
      requiresInstance: true,
      appliedTo: [],
      conditions: [],
    },
    {
      key: SIBLING_ELEMENT_KEY,
      description: 'Defines a sibling element to act as the copy target.',
      required: false,
      requiresInstance: false,
      appliedTo: [],
      conditions: [],
    },
  ],
  settings: [
    {
      key: TEXT_SETTING_KEY,
      description: 'Defines the text that will be success to the clipboard.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: SUCCESS_MESSAGE_SETTING_KEY,
      description: 'Defines the message that will be displayed on success.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: SUCESSS_DURATION_SETTING_KEY,
      description: 'Defines the duration of the success state.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'int',
        default: '0',
      },
    },
    {
      key: SUCESSS_CLASS_SETTING_KEY,
      description: 'Defines the CSS Class added to the trigger on the success state.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: SELECTOR_SETTING_KEY,
      description: 'Defines a selector for instantiating all queried elements as triggers.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
  ],
};
