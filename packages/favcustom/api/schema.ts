import { IMAGE } from '$global/constants/webflow-selectors';
import type { AttributeSchema } from '$global/types/schema';

import { SRC_ELEMENT_KEY } from '../src/constants';

export const schema: AttributeSchema = {
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
  settings: [
    // {
    //   key: SRC_SETTING_KEY,
    //   description: 'Defines the URL source of the image to be set as the favicon.',
    //   appliedTo: {
    //     elements: [SRC_ELEMENT_KEY],
    //   },
    //   conditions: [],
    //   value: {
    //     type: 'string',
    //   },
    // },
  ],
};
