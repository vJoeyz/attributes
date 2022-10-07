import type { LaunchDarklyAttributes } from '$packages/launchdarkly/src/utils/types';

/**
 * Inits the attribute.
 */
export const init = (attributes: LaunchDarklyAttributes): void => {
  console.log('Testing the first part of the init function', attributes);
};
