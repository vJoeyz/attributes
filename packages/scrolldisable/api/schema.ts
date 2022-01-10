import type { AttributeSchema } from '$global/types/schema';

import {
  WHEN_VISIBLE_ELEMENT_KEY,
  ENABLE_ELEMENT_KEY,
  DISABLE_ELEMENT_KEY,
  TOGGLE_ELEMENT_KEY,
  NAV_ELEMENT_KEY,
  PRESERVE_ELEMENT_KEY,
  SCROLLBAR_SETTING_KEY,
  MEDIA_SETTING_KEY,
  GAP_SETTING_KEY,
} from './../src/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: DISABLE_ELEMENT_KEY,
      description: 'Scrolling will be disabled when this element is clicked.',
      required: true,
      requiresInstance: false,
      conditions: [],
      appliedTo: ['div', 'button', 'span', 'a'],
    },
    {
      key: ENABLE_ELEMENT_KEY,
      description: 'Scrolling will be enabled when this element is clicked.',
      required: true,
      requiresInstance: false,
      conditions: [],
      appliedTo: ['div', 'button', 'span', 'a'],
    },
    {
      key: TOGGLE_ELEMENT_KEY,
      description: 'Scrolling will be disabled/enabled when this element is clicked.',
      required: true,
      requiresInstance: false,
      conditions: [],
      appliedTo: ['div', 'button', 'span', 'a'],
    },
    {
      key: WHEN_VISIBLE_ELEMENT_KEY,
      description: 'Scrolling will be disabled/enabled when this element becomes visible/hidden.',
      required: false,
      requiresInstance: false,
      conditions: [],
      appliedTo: [],
    },
    {
      key: NAV_ELEMENT_KEY,
      description:
        'Scrolling will be disabled/enabled when the `Nav Menu` is open/closed. Specific for `Navbar` components.',
      required: false,
      requiresInstance: false,
      conditions: [],
      appliedTo: [],
    },
    {
      key: PRESERVE_ELEMENT_KEY,
      description: "Applied on elements that must preserve scrolling when the page's scrolling is disabled.",
      required: false,
      requiresInstance: false,
      conditions: [],
      appliedTo: [],
    },
  ],
  settings: [
    {
      key: SCROLLBAR_SETTING_KEY,
      description: 'Defines the behavior of the scrollbar gap when disabling scrolling.',
      conditions: [],
      appliedTo: {},
      value: {
        type: 'options',
        default: 'keep',
        options: [
          {
            value: 'keep',
            description: 'The scrollbar gap will be reserved.',
          },
          {
            value: 'hide',
            description: 'The scrollbar gap will be removed and all content will be stretched.',
          },
        ],
      },
    },
    {
      key: MEDIA_SETTING_KEY,
      description: 'Used to define a media query that restricts when an element acts as a trigger.',
      conditions: [],
      appliedTo: {},
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: GAP_SETTING_KEY,
      description: 'Defines if the scrollbar gap must be reserved when disabling scrolling.',
      conditions: [],
      appliedTo: {},
      value: {
        type: 'boolean',
        default: 'true',
      },
    },
  ],
};
