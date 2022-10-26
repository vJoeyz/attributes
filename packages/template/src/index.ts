import { EXAMPLE_ATTRIBUTE } from '$global/constants/attributes';
import { initAttributes } from '$global/factory';

import { version } from '../package.json';
import { init } from './init';

/**
 * Init
 */
initAttributes({
  init,
  version,
  attributeKey: EXAMPLE_ATTRIBUTE,
});
