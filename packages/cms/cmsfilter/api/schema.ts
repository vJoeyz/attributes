import { CMS_CSS_CLASSES } from '@finsweet/ts-utils';

import type { AttributeSchema } from '$global/types/schema';

import {
  LIST_ELEMENT_KEY,
  FILTERS_ELEMENT_KEY,
  EMPTY_ELEMENT_KEY,
  INITIAL_ELEMENT_KEY,
  RESULTS_COUNT_ELEMENT_KEY,
  FILTER_RESULTS_COUNT_ELEMENT_KEY,
  ITEMS_COUNT_ELEMENT_KEY,
  TAG_TEMPLATE_ELEMENT_KEY,
  TAG_TEXT_ELEMENT_KEY,
  TAG_REMOVE_ELEMENT_KEY,
  SCROLL_ANCHOR_ELEMENT_KEY,
  RESET_ELEMENT_KEY,
  FIELD_SETTING_KEY,
  RESET_SETTING_KEY,
  MATCH_SETTING_KEY, // MATCH_SETTING_VALUES,
  RANGE_SETTING_KEY, // RANGE_SETTING_VALUES,
  TYPE_SETTING_KEY, // TYPE_SETTING_VALUES,
  SHOW_QUERY_SETTING_KEY, // SHOW_QUERY_SETTING_VALUES,
  HIDE_EMPTY_SETTING_KEY, // HIDE_EMPTY_SETTING_VALUES,
  HIGHLIGHT_SETTING_KEY, // HIGHLIGHT_SETTING_VALUES,
  HIGHLIGHT_CLASS_SETTING_KEY,
  ACTIVE_CLASS_SETTING_KEY,
  DEBOUNCE_SETTING_KEY,
  TAG_FORMAT_SETTING_KEY, // TAG_FORMAT_SETTING_VALUES,
  TAG_CATEGORY_SETTING_KEY,
  EASING_SETTING_KEY,
  DURATION_SETTING_KEY,
} from './../src/utils/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: LIST_ELEMENT_KEY,
      description: 'Defines a list to be filtered.',
      required: true,
      requiresInstance: true,
      appliedTo: [`.${CMS_CSS_CLASSES.list}`, `.${CMS_CSS_CLASSES.wrapper}`],
      conditions: [],
    },
    {
      key: FILTERS_ELEMENT_KEY,
      description: 'Defines the `Form` that holds the filters.',
      required: true,
      requiresInstance: true,
      appliedTo: ['form'],
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
    },
    {
      key: EMPTY_ELEMENT_KEY,
      description: 'Defines the Empty State element for when there are no filetered elements to show.',
      required: false,
      requiresInstance: true,
      appliedTo: ['div'],
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
    },
    {
      key: INITIAL_ELEMENT_KEY,
      description: 'Defines the initial element to be shown when the filter is first applied.',
      required: false,
      requiresInstance: true,
      appliedTo: ['div'],
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
    },
    {
      key: RESULTS_COUNT_ELEMENT_KEY,
      description: 'Defines an element that will display all existing results.',
      required: false,
      requiresInstance: true,
      appliedTo: ['div'],
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
    },
    {
      key: FILTER_RESULTS_COUNT_ELEMENT_KEY,
      description: 'Defines an element that will display the existing results for a specific filter.',
      required: false,
      requiresInstance: true,
      appliedTo: ['div'],
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
    },
    {
      key: ITEMS_COUNT_ELEMENT_KEY,
      description: 'Defines an element where to display the total items of the list.',
      required: false,
      requiresInstance: true,
      appliedTo: ['div'],
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
    },
    {
      key: TAG_TEMPLATE_ELEMENT_KEY,
      description: 'Defines a tag template element.',
      required: false,
      requiresInstance: true,
      appliedTo: ['div', 'button', 'a'],
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
    },
    {
      key: TAG_TEXT_ELEMENT_KEY,
      description: 'Defines the text node of a tag.',
      required: false,
      requiresInstance: false,
      appliedTo: ['div'],
      conditions: [
        {
          type: 'isChildOf',
          element: TAG_TEMPLATE_ELEMENT_KEY,
        },
      ],
    },
    {
      key: TAG_REMOVE_ELEMENT_KEY,
      description: 'Defines a remove trigger element of a tag.',
      required: false,
      requiresInstance: false,
      appliedTo: ['div', 'a', 'img'],
      conditions: [
        {
          type: 'isChildOf',
          element: TAG_TEMPLATE_ELEMENT_KEY,
        },
      ],
    },
    {
      key: SCROLL_ANCHOR_ELEMENT_KEY,
      description: 'Defines an element where to scroll the view every time a filter is applied.',
      required: false,
      requiresInstance: true,
      appliedTo: ['div'],
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
    },
    {
      key: RESET_ELEMENT_KEY,
      description: 'Defines a button that resets all filters when clicked.',
      required: false,
      requiresInstance: true,
      appliedTo: ['button', 'a'],
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
    },
  ],
  fields: [
    {
      key: FIELD_SETTING_KEY,
      description: 'Defines a field key to group filters.',
      specializations: [
        {
          key: 'default',
          appliedTo: [
            {
              parent: LIST_ELEMENT_KEY,
              selectors: ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a'],
            },
            {
              parent: FILTERS_ELEMENT_KEY,
              selectors: ['input', 'select', 'label'],
            },
          ],
        },
        {
          key: 'search-field',
          appliedTo: [
            {
              parent: FILTERS_ELEMENT_KEY,
              selectors: ['input'],
            },
          ],
        },
        {
          key: 'toggle-button',
          appliedTo: [
            {
              parent: `${LIST_ELEMENT_KEY} .w-embed`,
              selectors: ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a'],
            },
            {
              parent: FILTERS_ELEMENT_KEY,
              selectors: ['input[type="checkbox"]'],
            },
          ],
        },
      ],
    },
  ],
  settings: [
    {
      key: ACTIVE_CLASS_SETTING_KEY,
      description: "Defines an active CSS class that will be added to checked checkboxes/radios's parent element.",
      appliedTo: {
        elements: [LIST_ELEMENT_KEY],
        fields: [FIELD_SETTING_KEY],
      },
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: MATCH_SETTING_KEY,
      description: 'Defines the matching mode.',
      appliedTo: {
        fields: [FIELD_SETTING_KEY],
      },
      conditions: [],
      value: {
        type: 'options',
        default: 'any',
        options: [
          {
            value: 'any',
            description: 'Any of the selected filters have to match in the item for the item to be filtered.',
          },
          {
            value: 'all',
            description: 'All of the selected filters have to match in the item for the item to be filtered.',
          },
        ],
      },
    },

    {
      key: TYPE_SETTING_KEY,
      description: 'Defines a specific field type.',
      appliedTo: {
        fields: [FIELD_SETTING_KEY],
      },
      conditions: [],
      value: {
        type: 'options',
        default: '',
        options: [
          {
            value: 'date',
            description: 'Indicates that the filter input is in date format',
          },
        ],
      },
    },
    {
      key: HIDE_EMPTY_SETTING_KEY,
      description: 'Defines if a filter element should be hidden when there are no results for it.',
      appliedTo: {},
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: RANGE_SETTING_KEY,
      description: 'Defines a range to filter.',
      appliedTo: {
        fields: [FIELD_SETTING_KEY],
      },
      specializations: [{ value: 'from' }, { value: 'to' }],
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: RESET_SETTING_KEY,
      description: 'Defines a specific field key to be resetted when clicking a Reset button.',
      appliedTo: {
        elements: [RESET_ELEMENT_KEY],
      },
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: SHOW_QUERY_SETTING_KEY,
      description: 'Defines if the filter query params should be displayed on the URL.',
      appliedTo: {
        elements: [LIST_ELEMENT_KEY],
      },
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: TAG_FORMAT_SETTING_KEY,
      description: 'Defines the format of the tag.',
      appliedTo: {
        elements: [LIST_ELEMENT_KEY],
        fields: [FIELD_SETTING_KEY],
      },
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: TAG_CATEGORY_SETTING_KEY,
      description: 'Overrides the key display of a filter when using the `category` tag format.',
      appliedTo: {
        fields: [FIELD_SETTING_KEY],
        /** @todo validate tagformat */
      },
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: DEBOUNCE_SETTING_KEY,
      description: 'Defines the debouncing for input events.',
      appliedTo: {
        elements: [LIST_ELEMENT_KEY],
        fields: [FIELD_SETTING_KEY],
      },
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: HIGHLIGHT_SETTING_KEY,
      description: 'Defines if the filter query should highlight the matching item props.',
      appliedTo: {
        fields: [FIELD_SETTING_KEY],
      },
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: HIGHLIGHT_CLASS_SETTING_KEY,
      description: 'Defines the highlight CSS class to be used to highlight elements.',
      appliedTo: {
        elements: [LIST_ELEMENT_KEY],
      },
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
    {
      key: EASING_SETTING_KEY,
      description: 'Defines the easing function of the list animation.',
      appliedTo: {
        elements: [LIST_ELEMENT_KEY],
      },
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
        type: 'string',
        default: '',
      },
    },
  ],
};
