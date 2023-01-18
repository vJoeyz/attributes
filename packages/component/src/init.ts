import { CMS_ATTRIBUTE_ATTRIBUTE } from '$global/constants/attributes';
import { awaitAttributesLoad } from '$global/factory';

import { getAbsoluteSource } from './actions/absolute_source';
import { getExternalSource } from './actions/external_source';
import { getRelativeSource } from './actions/relative_source';

/**
 * Inits the attribute.
 */
export const init = async () => {
  await awaitAttributesLoad(CMS_ATTRIBUTE_ATTRIBUTE);

  getAbsoluteSource();
  getRelativeSource();
  getExternalSource();
};
