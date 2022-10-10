import { extractCommaSeparatedValues } from '@finsweet/ts-utils';
import type { LDFlagSet } from 'launchdarkly-js-client-sdk';

import { ATTRIBUTES, getSelector } from '../utils/constants';

export const showOrHideElement = (flags: LDFlagSet): void => {
  const elements = document.querySelectorAll<HTMLElement>(getSelector('showIf'));

  elements.forEach((element) => {
    const flagName = element.getAttribute(ATTRIBUTES.flag.key);
    const flagValue = element.getAttribute(ATTRIBUTES.showIf.key);

    if (!flagName || !flagValue) {
      element.remove();
      return;
    }
    const allFlagValues = extractCommaSeparatedValues(flagValue);
    if (flags[flagName] === null || flags[flagName] === undefined) return;

    const flag = String(flags[flagName]);
    if (flag && allFlagValues.includes(flag)) {
      element.removeAttribute(ATTRIBUTES.showIf.key);
    } else {
      element.remove();
    }
  });
};
