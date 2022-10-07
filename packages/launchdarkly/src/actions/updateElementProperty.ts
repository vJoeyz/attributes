import type { LaunchDarklyFlags } from '$packages/launchdarkly/src/utils/types';

export const updateElementProperty = (flags: LaunchDarklyFlags): void => {
  console.log('updateElementProperty', flags);
};
