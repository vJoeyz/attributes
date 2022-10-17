import { initAttribute } from '$global/factory';

import { version } from '../package.json';
import { ATTRIBUTE } from './constants';
import { init } from './init';

/**
 * Init
 */
initAttribute({
  init,
  version,
  attributeKey: ATTRIBUTE,
});
