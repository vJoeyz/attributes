import { CMS_ATTRIBUTE_ATTRIBUTE } from '$global/constants/attributes';
import { awaitAttributesLoad } from '$global/factory';

import { getAbsoluteSource } from './actions/absolute_source';
import { collectComponentTargets } from './actions/collect';
import { getExternalSource } from './actions/external_source';
import { getRelativeSource } from './actions/relative_source';
import type { ComponentTarget } from './utils/types';

/**
 * Inits the attribute.
 */
export const init = async () => {
  await awaitAttributesLoad(CMS_ATTRIBUTE_ATTRIBUTE);

  const componentTargets = collectComponentTargets();

  // getAbsoluteSource();
  // getRelativeSource();
  // getExternalSource();
};

// const initComponentTarget = (componentTarget: ComponentTarget) => {};
