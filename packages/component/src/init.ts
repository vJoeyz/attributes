import { CMS_ATTRIBUTE_ATTRIBUTE, COMPONENT_ATTRIBUTE } from '$global/constants/attributes';
import { awaitAttributesLoad, finalizeAttribute } from '$global/factory';

import { collectComponentTargetsData } from './actions/collect';
import { initComponents } from './factory';

/**
 * Inits the attribute.
 */
export const init = async ({ proxy }: { proxy: string | null }) => {
  await awaitAttributesLoad(CMS_ATTRIBUTE_ATTRIBUTE);

  const componentTargetsData = collectComponentTargetsData(proxy);

  const componentsData = await initComponents(componentTargetsData);

  return finalizeAttribute(COMPONENT_ATTRIBUTE, componentsData);
};
