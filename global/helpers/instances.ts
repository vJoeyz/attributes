import { extractNumberSuffix } from '@finsweet/ts-utils';

/**
 * Gets the instance index of an element attribute.
 * @example An element with the `fs-copyclip-element="trigger-1"` attribute will return `1` as the instance index.
 * @param element The element to extract the instance index.
 * @param attributeKey The attribute key that holds the instance index.
 */
export const getInstanceIndex = (element: Element, attributeKey: string): number | undefined => {
  const elementValue = element.getAttribute(attributeKey);
  const instanceIndex = elementValue ? extractNumberSuffix(elementValue) : undefined;

  return instanceIndex;
};
