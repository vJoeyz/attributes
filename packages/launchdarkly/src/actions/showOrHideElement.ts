import type { LaunchDarklyFlags } from '$packages/launchdarkly/src/utils/types';

import { ATTRIBUTES } from '../utils/constants';

export const showOrHideElement = (flags: LaunchDarklyFlags): void => {
  const elements: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>(`[${ATTRIBUTES.showIf.key}]`);

  elements.forEach((element) => {
    // get the value of the attribute fs-launchdarkly-showif
    const flagName = element.getAttribute(ATTRIBUTES.flag.key) || '';
    const flagValue = element.getAttribute(ATTRIBUTES.showIf.key) || '';
    const allFlagValues = flagValue.split(',');

    if (flags[flagName] && allFlagValues && allFlagValues.includes(String(flags[flagName]))) {
      element.removeAttribute(ATTRIBUTES.showIf.key);
    } else {
      element.remove();
    }
  });
};
