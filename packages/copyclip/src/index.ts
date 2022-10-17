import { COPY_CLIP_ATTRIBUTE } from '$global/constants/attributes';
import { initAttribute } from '$global/factory/init';

import { version } from '../package.json';
import { init } from './init';

/**
 * Init
 */
initAttribute({
  init,
  version,
  attributeKey: COPY_CLIP_ATTRIBUTE,
});
