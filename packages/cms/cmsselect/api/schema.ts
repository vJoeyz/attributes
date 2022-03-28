import { COLLECTION_ITEM, TEXT_ELEMENT, SELECT } from '$global/constants/webflow-selectors';

import type { AttributeSchema } from '$global/types/schema';

import { TEXT_VALUE_ELEMENT_KEY, SELECT_ELEMENT_KEY } from './../src/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: TEXT_VALUE_ELEMENT_KEY,
      description: 'Defines the elements as the source to populate the target.',
      appliedTo: [TEXT_ELEMENT],
      conditions: [
        {
          type: 'isChildOf',
          selector: COLLECTION_ITEM,
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
          type: 'exists',
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
