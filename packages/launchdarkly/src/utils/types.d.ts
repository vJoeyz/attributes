import { CLIENT_ID } from '$packages/launchdarkly/src/utils/constants';

export interface LaunchDarklyAttributes {
  [CLIENT_ID]: string | null | undefined;
}

type LaunchDarklyFlags = Record<string, string | number>;
