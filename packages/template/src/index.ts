import { EXAMPLE_ATTRIBUTE } from '$global/constants/attributes';
import { initAttributesV2 } from '$global/factory';

import { version } from '../package.json';
import { init } from './init';

/**
 * Init
 */
initAttributesV2({
  init,
  version,
  attributeKey: EXAMPLE_ATTRIBUTE,
});
