import { initializeUser } from '$packages/launchdarkly/src/actions/initializeUser';
import { showOrHideElement } from '$packages/launchdarkly/src/actions/showOrHideElement';
import { updateElementProperty } from '$packages/launchdarkly/src/actions/updateElementProperty';
import type { LaunchDarklyAttributes } from '$packages/launchdarkly/src/utils/types';

/**
 * Inits the attribute.
 */
export const init = async (attributes: LaunchDarklyAttributes): Promise<void> => {
  if (!attributes.clientId) {
    throw new Error('clientId is required');
    return;
  }

  const client = await initializeUser(attributes.clientId);
  const flags = client.allFlags();
  showOrHideElement(flags);
  updateElementProperty(flags);
};
