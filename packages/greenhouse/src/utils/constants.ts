import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Added to either the Collection List Wrapper or the Collection List.
   */
  'list',

  /**
   * Added to any <a> element, it will append the job ID as a query parameter
   */
  'link',

  /**
   * Added to any text element, it will display the Job Title.
   */
  'title',

  /**
   * Added to a Rich Text Block, it will display the Job Description.
   */
  'description',

  /**
   * Added to any text element, it will display the Job Office name.
   */
  'office',

  /**
   * Added to any text element, it will display the Job Department name.
   */
  'department',

  /**
   * Added to any link or button element, it will set the link href to the Greenhouse job application page.
   */
  'apply',

  /**
   * Defines a Job Application Form
   */
  'form',

  /**
   * Added to a wrapper Div that holds the Question elements. This element will be cloned for each question.
   */
  'questions',

  /**
   * Display the header of a set of questions.
   */
  'questions-header',

  /**
   *  It will display the description of a set of questions
   */
  'questions-description',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines the query parameter used to define a job ID. Defaults to id.
   */
  queryparam: { key: 'queryparam' },

  board: { key: 'board' },

  filter: { key: 'filter' },

  display: { key: 'display' },

  element: { key: 'element' },
} as const satisfies AttributeSettings;

export const DEFAULT_QUERY_PARAM_SETTING_KEY = 'id';

export const GH_API_BASE = 'https://boards-api.greenhouse.io/v1/boards/';

export const GH_API_JOBS = '/jobs';

export const GH_DEPARTMENT = 'department';

export const GH_OFFICE = 'office';

export const SUPPORTED_NESTED_KEYS = [GH_DEPARTMENT, GH_OFFICE];
