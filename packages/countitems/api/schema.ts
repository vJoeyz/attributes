import { CMS_CSS_CLASSES } from '@finsweet/ts-utils';

import type { AttributeSchema } from '$global/types/schema';

import { LIST_ELEMENT_KEY, VALUE_ELEMENT_KEY } from './../src/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: LIST_ELEMENT_KEY,
      description: 'Defines the CMS list or list-wrapper.',
      required: true,
      requiresInstance: true,
      appliedTo: [`.${CMS_CSS_CLASSES.wrapper}`, `.${CMS_CSS_CLASSES.list}`],
      conditions: [],
    },
    {
      key: VALUE_ELEMENT_KEY,
      description: 'Defines the element that will display the amount of CMS items.',
      required: true,
      requiresInstance: true,
      appliedTo: ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'],
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
    },
  ],
  settings: [],
};
