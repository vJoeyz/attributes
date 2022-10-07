import { initializeUser } from '$packages/launchdarkly/src/actions/initializeUser';
import { showOrHideElement } from '$packages/launchdarkly/src/actions/showOrHideElement';
import { updateElementProperty } from '$packages/launchdarkly/src/actions/updateElementProperty';
import type { LaunchDarklyAttributes } from '$packages/launchdarkly/src/utils/types';

/**
 * Inits the attribute.
 */
export const init = async (attributes: LaunchDarklyAttributes): Promise<void> => {
  const clientId = attributes.prodClientId || attributes.devClientId;
  if (!clientId) {
    throw new Error('fs-launchdarkly-devclientid/fs-launchdarkly-prodclientid is required');
  }

  const client = await initializeUser(clientId);
  const flags = client.allFlags();
  showOrHideElement(flags);
  updateElementProperty(flags);
};
