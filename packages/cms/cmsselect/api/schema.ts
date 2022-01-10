import { CMS_CSS_CLASSES } from '@finsweet/ts-utils';

import type { AttributeSchema } from '$global/types/schema';

import { TEXT_VALUE_ELEMENT_KEY, SELECT_ELEMENT_KEY } from './../src/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: TEXT_VALUE_ELEMENT_KEY,
      description: 'Defines the elements as the source to populate the target.',
      appliedTo: ['p'],
      conditions: [
        {
          type: 'isChildOf',
          selector: `.${CMS_CSS_CLASSES.item}`,
        },
      ],
      required: true,
      requiresInstance: true,
    },
    {
      key: SELECT_ELEMENT_KEY,
      description: 'Defines the element as the target to be populated.',
      appliedTo: ['select'],
      conditions: [
        {
          type: 'exists',
          element: TEXT_VALUE_ELEMENT_KEY,
        },
      ],
      required: true,
      requiresInstance: true,
    },
  ],
  settings: [],
};
