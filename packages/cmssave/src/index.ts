import { initAttributesV2 } from '$global/factory';

import { version } from '../package.json';
import { init } from './init';
import { ATTRIBUTE } from './utils/constants';

/**
 * Init
 */
initAttributesV2({
  init,
  version,
  attributeKey: ATTRIBUTE,
});
