import type { AttributeSchema } from '$global/types/schema';

import {
  RICH_TEXT_ELEMENT_KEY,
  COMPONENT_SETTING_KEY,
  SANITIZE_SETTING_KEY,
  RESET_IX_SETTING_KEY,
  GLOBAL_SELECTOR_SETTING_KEY,
} from './../src/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: RICH_TEXT_ELEMENT_KEY,
      description: 'Defines a rich text block instance.',
      conditions: [],
      appliedTo: [],
      required: true,
      requiresInstance: false,
    },
  ],
  settings: [
    {
      key: COMPONENT_SETTING_KEY,
      description: 'Defines a custom component.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: SANITIZE_SETTING_KEY,
      description: 'Defines if the HTML should be sanitized before rendering it.',
      conditions: [],
      appliedTo: {},
      value: {
        type: 'boolean',
        default: 'true',
      },
    },
    {
      key: RESET_IX_SETTING_KEY,
      description: 'Defines if Webflow should be restarted after loading new items.',
      conditions: [],
      appliedTo: {},
      value: {
        type: 'boolean',
        default: 'true',
      },
    },
    {
      key: GLOBAL_SELECTOR_SETTING_KEY,
      description: 'Defines a global selector for RTB elements.',
      conditions: [],
      appliedTo: {},
      value: {
        type: 'string',
        default: '',
      },
    },
  ],
};
