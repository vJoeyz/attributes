import { CMS_CSS_CLASSES } from '@finsweet/ts-utils';

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
} from '../src/utils/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: LIST_ELEMENT_KEY,
      description: 'Defines a list to be combined into the target.',
      appliedTo: [`.${CMS_CSS_CLASSES.list}`, `.${CMS_CSS_CLASSES.wrapper}`],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
    {
      key: SCROLL_ANCHOR_ELEMENT_KEY,
      description: 'Defines an element where to scroll the view every time a filter is applied.',
      appliedTo: [],
      conditions: [],
      required: false,
      requiresInstance: true,
    },
  ],
  fields: [
    {
      key: FIELD_SETTING_KEY,
      description: 'Defines a field key to sort items.',
      specializations: [
        {
          key: 'select-trigger',
          appliedTo: [
            {
              parent: LIST_ELEMENT_KEY,
              selectors: ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a'],
            },
            {
              parent: null,
              selectors: ['select'],
              key: 'element',
              value: TRIGGER_ELEMENT_KEY,
            },
            {
              parent: 'select',
              selectors: ['option'],
              value: `$FIELD-asc`,
            },
            {
              parent: 'select',
              selectors: ['option'],
              value: `$FIELD-desc`,
            },
          ],
        },
        {
          key: 'button-trigger',
          appliedTo: [
            {
              parent: LIST_ELEMENT_KEY,
              selectors: ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a'],
            },
            {
              parent: null,
              selectors: ['button'],
              key: 'element',
              value: TRIGGER_ELEMENT_KEY,
            },
          ],
        },
        {
          key: 'dropdown-trigger',
          appliedTo: [
            {
              parent: LIST_ELEMENT_KEY,
              selectors: ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a'],
            },
            {
              parent: null,
              selectors: ['.w-dropdown'],
              key: 'element',
              value: TRIGGER_ELEMENT_KEY,
            },
            {
              parent: '.w-dropdown',
              selectors: ['div'],
              value: `$FIELD-asc`,
            },
            {
              parent: '.w-dropdown',
              selectors: ['div'],
              value: `$FIELD-desc`,
            },
          ],
        },
      ],
    },
  ],
  settings: [
    {
      key: TYPE_SETTING_KEY,
      description: 'Defines the type of the values to sort.',
      appliedTo: {
        fields: [FIELD_SETTING_KEY],
      },
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
      value: {
        type: 'string',
        default: 'date',
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
      appliedTo: {
        elements: [LIST_ELEMENT_KEY],
      },
      conditions: [],
      value: {
        type: 'int',
        default: '100',
      },
    },
    {
      key: ASC_CLASS_SETTING_KEY,
      description: 'Defines the CSS Class for the `asc` state.',
      appliedTo: {
        fields: [FIELD_SETTING_KEY],
        specializations: ['button-trigger'],
      },
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: DESC_CLASS_SETTING_KEY,
      description: 'Defines the CSS Class for the `desc` state.',
      appliedTo: {
        fields: [FIELD_SETTING_KEY],
        specializations: ['button-trigger'],
      },
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
