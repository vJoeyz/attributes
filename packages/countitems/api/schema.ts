import type { AttributeSchema } from '@finsweet/attributes-utils';
import { COLLECTION_LIST, DIV_BLOCK, HEADING, LIST, PARAGRAPH, SECTION, TEXT_BLOCK } from '@finsweet/attributes-utils';

import { LIST_ELEMENT_KEY, VALUE_ELEMENT_KEY } from '../src/utils/constants';

const schema: AttributeSchema = {
  elements: [
    {
      key: LIST_ELEMENT_KEY,
      description: 'Defines the CMS list or list-wrapper.',
      required: true,
      requiresInstance: true,
      multiplesInInstance: false,
      appliedTo: [COLLECTION_LIST, DIV_BLOCK, SECTION, LIST],
      conditions: [],
    },
    {
      key: VALUE_ELEMENT_KEY,
      description: 'Defines the element that will display the amount of CMS items.',
      required: true,
      requiresInstance: true,
      multiplesInInstance: false,
      appliedTo: [TEXT_BLOCK, PARAGRAPH, HEADING],
      conditions: [
        {
          condition: 'exists',
          type: 'element',
          element: LIST_ELEMENT_KEY,
        },
      ],
    },
  ],
  settings: [],
};

export default schema;
