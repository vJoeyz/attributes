import type { AttributeSchema } from '$global/types/schema';

import {
  SLIDER_ELEMENT_KEY,
  CONTENT_ELEMENT_KEY,
  SLIDER_NAV_ELEMENT_KEY,
  ACTIVE_SETTING_KEY,
  REMOVE_SETTING_KEY,
} from './../src/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: SLIDER_ELEMENT_KEY,
      description: 'Defines a slider to instantiate.',
      required: true,
      requiresInstance: true,
      appliedTo: [],
      conditions: [],
    },
    {
      key: CONTENT_ELEMENT_KEY,
      description: 'Defines the content to be added to the slider dot.',
      required: true,
      requiresInstance: true,
      appliedTo: [],
      conditions: [],
    },
    {
      key: SLIDER_NAV_ELEMENT_KEY,
      description: 'Defines a custom Slide Nav.',
      required: true,
      requiresInstance: true,
      appliedTo: [],
      conditions: [],
    },
  ],
  settings: [
    {
      key: ACTIVE_SETTING_KEY,
      description: 'Defines the `active` CSS class',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: REMOVE_SETTING_KEY,
      description: 'Defines if the content should be removed or just duplicated.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'boolean',
        default: 'true',
      },
    },
  ],
};
