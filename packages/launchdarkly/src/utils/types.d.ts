import { CLIENT_ID } from '$packages/launchdarkly/src/utils/constants';

type LaunchDarklyAttributeKey = CLIENT_ID;
export interface LaunchDarklyAttributes {
  [key in LaunchDarklyAttributeKey]: string;
}
