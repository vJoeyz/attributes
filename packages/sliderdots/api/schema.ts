import type { AttributeSchema } from '$global/types/schema';

import {
  SLIDER_ELEMENT_KEY,
  CONTENT_ELEMENT_KEY,
  SLIDER_NAV_ELEMENT_KEY,
  ACTIVE_SETTING_KEY,
  REMOVE_SETTING_KEY,
  DEFAULT_ACTIVE_CSS_CLASS,
} from '../src/utils/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: SLIDER_ELEMENT_KEY,
      description: 'Defines a slider to instantiate.',
      required: true,
      requiresInstance: true,
      appliedTo: ['.w-slider'],
      conditions: [],
    },
    {
      key: CONTENT_ELEMENT_KEY,
      description: 'Defines the content to be added to the slider dot.',
      required: true,
      requiresInstance: false,
      appliedTo: [],
      conditions: [
        {
          type: 'isChildOf',
          element: SLIDER_ELEMENT_KEY,
        },
      ],
    },
    {
      key: SLIDER_NAV_ELEMENT_KEY,
      description: 'Defines a custom Slide Nav.',
      required: false,
      requiresInstance: true,
      appliedTo: [],
      conditions: [
        {
          type: 'exists',
          element: SLIDER_ELEMENT_KEY,
        },
      ],
    },
  ],
  settings: [
    {
      key: ACTIVE_SETTING_KEY,
      description: 'Defines the `active` CSS class',
      appliedTo: {
        elements: [CONTENT_ELEMENT_KEY],
      },
      conditions: [],
      value: {
        type: 'string',
        default: DEFAULT_ACTIVE_CSS_CLASS,
      },
    },
    {
      key: REMOVE_SETTING_KEY,
      description: 'Defines if the content should be removed or just duplicated.',
      appliedTo: {
        elements: [CONTENT_ELEMENT_KEY],
      },
      conditions: [],
      value: {
        type: 'boolean',
        default: 'true',
      },
    },
  ],
};
