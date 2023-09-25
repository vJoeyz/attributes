import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines a list wrapper element.
   */
  'wrapper',

  /**
   * Defines a list element.
   */
  'list',

  /**
   * Defines a list item element.
   */
  'item',

  /**
   * Defines a pagination wrapper element.
   */
  'pagination-wrapper',

  /**
   * Defines a pagination next element.
   */
  'pagination-next',

  /**
   * Defines a pagination previous element.
   */
  'pagination-previous',

  /**
   * Defines a page-count element.
   */
  'page-count',

  /**
   * Defines a empty element.
   */
  'empty',

  /**
   * Defines a sorting trigger.
   */
  'sort-trigger',

  /**
   * Defines a dropdown label.
   */
  'dropdown-label',

  /**
   * Loader
   */
  'loader',

  /**
   * Items count
   */
  'items-count',

  /**
   * Visible count
   */
  'visible-count',

  /**
   * Visible count from
   */
  'visible-count-from',

  /**
   * Visible count to
   */
  'visible-count-to',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines an item field.
   */
  field: {
    key: 'field',
  },

  /**
   * Defines an item field type.
   */
  type: {
    key: 'type',
    values: { number: 'number', date: 'date' },
  },

  /**
   * Defines an item field range.
   */
  range: {
    key: 'range',
    values: { from: 'from', to: 'to' },
  },

  /**
   * Defines if sorting should start reversed.
   */
  reverse: {
    key: 'reverse',
    values: { true: 'true' },
  },

  /**
   * Defines the ascending CSS class.
   */
  ascclass: {
    key: 'ascclass',
    values: { default: 'is-list-asc' },
  },

  /**
   * Defines the descending CSS class.
   */
  descclass: {
    key: 'descclass',
    values: { default: 'is-list-desc' },
  },

  /**
   * Defines the descending CSS class.
   */
  loadmode: {
    key: 'loadmode',
    values: { default: 'load-under', infinite: 'infinite', pagination: 'pagination', renderAll: 'render-all' },
  },
} as const satisfies AttributeSettings;
