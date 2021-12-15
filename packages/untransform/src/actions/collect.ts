import { getInstanceIndex } from '$global/helpers/instances';

import { ATTRIBUTES, getSelector } from '../utils/constants';

/**
 * Queries the correspondent fixed element of a specific trigger.
 * @param trigger The trigger element.
 */
export const getFixedElement = (trigger: Element) => {
  const instanceIndex = getInstanceIndex(trigger, ATTRIBUTES.element.key);

  const fixedElementSelector = getSelector('element', 'fixed', { instanceIndex });
  const fixedElement =
    trigger.parentElement?.querySelector(fixedElementSelector) || document.querySelector(fixedElementSelector);

  return fixedElement;
};
