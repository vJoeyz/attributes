import { CLIENT_ID } from '$packages/launchdarkly/src/utils/constants';

export interface LaunchDarklyAttributes {
  [CLIENT_ID]: string | null | undefined;
}

export type LaunchDarklyFlagValueType = string | number | boolean | null | undefined;

type LaunchDarklyFlags = Record<LaunchDarklyFlagValueType>;
