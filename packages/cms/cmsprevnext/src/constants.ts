import { generateSelectors } from '$global/factory/selectors';

const ATTRIBUTES_PREFIX = 'fs-cmsprevnext';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a list to be combined into the target.
       */
      list: 'list',

      /**
       * Defines the `Previous` placeholder target.
       */
      previous: 'previous',

      /**
       * Defines the `Previous` Empty State.
       */
      previousEmpty: 'previous-empty',

      /**
       * Defines the `Next` placeholder target.
       */
      next: 'next',

      /**
       * Defines the `Next` Empty State.
       */
      nextEmpty: 'next-empty',
    },
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
