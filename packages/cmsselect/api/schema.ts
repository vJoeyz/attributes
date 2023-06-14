import type { AttributeSchema } from '@finsweet/attributes-utils';
import { COLLECTION_ITEM, SELECT, TEXT_ELEMENT } from '@finsweet/attributes-utils';

import { SELECT_ELEMENT_KEY, TEXT_VALUE_ELEMENT_KEY } from '../src/utils/constants';

const schema: AttributeSchema = {
  elements: [
    {
      key: TEXT_VALUE_ELEMENT_KEY,
      description: 'Defines the elements as the source to populate the target.',
      appliedTo: [TEXT_ELEMENT],
      conditions: [
        {
          condition: 'isChildOf',
          type: 'selector',
          selector: [COLLECTION_ITEM],
        },
      ],
      multiplesInInstance: true,
      required: true,
      requiresInstance: true,
    },
    {
      key: SELECT_ELEMENT_KEY,
      description: 'Defines the element as the target to be populated.',
      appliedTo: [SELECT],
      conditions: [
        {
          condition: 'exists',
          type: 'element',
          element: TEXT_VALUE_ELEMENT_KEY,
        },
      ],
      multiplesInInstance: false,
      required: true,
      requiresInstance: true,
    },
  ],
  settings: [],
};

export default schema;
