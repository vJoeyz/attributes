import { CMS_ATTRIBUTE_ATTRIBUTE, COMPONENT_ATTRIBUTE } from '$global/constants/attributes';
import { awaitAttributesLoad, finalizeAttribute } from '$global/factory';

import { getAbsoluteSource } from './actions/absolute_source';
import { logHello } from './actions/console';
import { getRelativeSource } from './actions/relative_source';

/**
 * Inits the attribute.
 */
export const init = async () => {
  await awaitAttributesLoad(CMS_ATTRIBUTE_ATTRIBUTE);

  logHello();
  getAbsoluteSource();
  getRelativeSource();

  return finalizeAttribute(COMPONENT_ATTRIBUTE);
};
