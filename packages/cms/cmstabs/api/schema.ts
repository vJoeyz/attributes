import type { AttributeSchema } from '$global/types/schema';

import { LIST_ELEMENT_KEY, TABS_ELEMENT_KEY, TAB_LINK_ELEMENT_KEY } from './../src/constants'

export const schema: AttributeSchema = {
  elements: [
    {
      key: LIST_ELEMENT_KEY,
      description: 'Defines a list to be included into the target tabs.',
      appliedTo: [],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
    {
      key: TABS_ELEMENT_KEY,
      description: 'Defines the target tabs where all lists will be included into.',
      appliedTo: [],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
    {
      key: TAB_LINK_ELEMENT_KEY,
      description: 'Defines the content that will be placed inside the generated `Tab Link` in the `Tabs Menu`.',
      appliedTo: [],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
  ],
  settings: [],
};
