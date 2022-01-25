import { CMS_CSS_CLASSES, SLIDER_CSS_CLASSES } from '@finsweet/ts-utils';

import type { AttributeSchema } from '$global/types/schema';

import { LIST_ELEMENT_KEY, SLIDER_ELEMENT_KEY } from './../src/constants';

export const schema: AttributeSchema = {
  elements: [
    {
      key: LIST_ELEMENT_KEY,
      description: 'Defines a list to be included into the target slider.',
      appliedTo: [`.${CMS_CSS_CLASSES.list}`],
      conditions: [],
      required: true,
      requiresInstance: true,
    },
    {
      key: SLIDER_ELEMENT_KEY,
      description: 'Defines the target slider where all lists will be included into.',
      appliedTo: [`.${SLIDER_CSS_CLASSES.slider}`],
      conditions: [
        {
          type: 'exists',
          element: LIST_ELEMENT_KEY,
        },
      ],
      required: true,
      requiresInstance: true,
    },
  ],
  settings: [],
};
