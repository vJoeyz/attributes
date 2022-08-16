import type { AttributeSchema } from '@global/types/schema';
import { ANY_ELEMENT, COLLECTION_ITEM, HEADING, PARAGRAPH, TEXT_BLOCK } from 'global/constants/webflow-selectors';

import { FIELD_ELEMENT_KEY, NAME_ELEMENT_KEY, VALUE_ELEMENT_KEY } from '../src/utils/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: NAME_ELEMENT_KEY,
      description: 'Name of attribute',
      requiresInstance: false,
      multiplesInInstance: false,
      required: true,
      appliedTo: [TEXT_BLOCK, HEADING, PARAGRAPH],
      conditions: [],
      scope: COLLECTION_ITEM,
    },
    {
      key: VALUE_ELEMENT_KEY,
      description: 'Value of attribute',
      requiresInstance: false,
      multiplesInInstance: false,
      required: true,
      appliedTo: [TEXT_BLOCK, HEADING, PARAGRAPH],
      conditions: [],
      scope: COLLECTION_ITEM,
    },
  ],
  settings: [],
  fields: [
    {
      key: FIELD_ELEMENT_KEY,
      description: 'Defines a field key to group attribute.',
      specializations: [
        {
          key: 'default',
          label: 'Default',
          appliedTo: [
            {
              parent: null,
              selectors: [ANY_ELEMENT],
              type: 'default',
            },
            {
              element: NAME_ELEMENT_KEY,
              parent: null,
              type: 'element',
            },
            {
              element: VALUE_ELEMENT_KEY,
              parent: null,
              type: 'element',
            },
          ],
        },
      ],
    },
  ],
};
