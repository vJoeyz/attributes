import type { AttributeSchema } from '@finsweet/attributes-utils';
import { IMAGE } from '@finsweet/attributes-utils';

import { SRC_ELEMENT_KEY } from '../src/utils/constants';

const schema: AttributeSchema = {
  elements: [
    {
      key: SRC_ELEMENT_KEY,
      description: 'Defines an `<img>` element which `src` will be set as the favicon.',
      appliedTo: [IMAGE],
      multiplesInInstance: false,
      conditions: [],
      required: true,
      requiresInstance: false,
    },
  ],
  settings: [],
};

export default schema;
