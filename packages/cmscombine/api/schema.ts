import type { AttributeSchema } from '@finsweet/attributes-utils';
import { COLLECTION_LIST, TEXT_ELEMENT } from '@finsweet/attributes-utils';

import { ITEMS_COUNT_ELEMENT_KEY, LIST_ELEMENT_KEY } from '../src/utils/constants';

const schema: AttributeSchema = {
  elements: [
    {
      key: LIST_ELEMENT_KEY,
      description: 'Defines a list to be combined into the target.',
      conditions: [],
      appliedTo: [COLLECTION_LIST],
      multiplesInInstance: true,
      required: true,
      requiresInstance: true,
    },
    {
      key: ITEMS_COUNT_ELEMENT_KEY,
      description: 'Defines an element where to display the total items of the list.',
      conditions: [
        {
          condition: 'exists',
          type: 'element',
          element: LIST_ELEMENT_KEY,
        },
      ],
      appliedTo: [TEXT_ELEMENT],
      multiplesInInstance: false,
      required: false,
      requiresInstance: true,
    },
  ],
  settings: [],
};

export default schema;
