import type { AttributeSchema } from '$global/types/schema';

import { CODE_ELEMENT_KEY, THEME_SETTING_KEY } from './../src/utils/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: CODE_ELEMENT_KEY,
      description: 'Defines a `<code>` element that holds the code to be highlighted.',
      appliedTo: [],
      conditions: [],
      requiresInstance: false,
      multiplesInInstance: true,
      required: true,
    },
  ],
  settings: [
    {
      key: THEME_SETTING_KEY,
      description: 'Defines the highlighting theme.',
      appliedTo: {
        elements: [CODE_ELEMENT_KEY],
      },
      conditions: [],
      value: {
        type: 'string',
        default: '',
      },
    },
  ],
};
