import { ATTRIBUTES, getSelector } from '$packages/launchdarkly/src/utils/constants';

export const extractElementsByCategory = () => {
  const allElements = document.querySelectorAll<HTMLElement>(getSelector('flag'));
  const showOrHideElements: HTMLElement[] = [];
  const updateElementPropertyElements: HTMLElement[] = [];
  const jsonPropertiesElement: HTMLElement[] = [];

  for (const element of allElements) {
    const flagName = element.getAttribute(ATTRIBUTES.flag.key);
    const showIf = element.getAttribute(ATTRIBUTES.showIf.key);
    const property = element.getAttribute(ATTRIBUTES.setProperty.key);
    if (!flagName) {
      continue;
    }

    if (showIf !== null && showIf !== undefined) {
      showOrHideElements.push(element);
    } else if (property !== null && property !== undefined) {
      updateElementPropertyElements.push(element);
    } else {
      jsonPropertiesElement.push(element);
    }
  }
  return { showOrHideElements, updateElementPropertyElements, jsonPropertiesElement };
};
