import { SRC_PROPERTY, SRCSET_PROPERTY, SIZES_PROPERTY, TEXT_PROPERTY } from '../utils/constants';

/**
 * Updates an element's properties with a value.
 * @param element The element to update.
 * @param properties The properties of the element to update.
 * @param value The value to set to the property.
 */
export const updateElementProperty = (element: HTMLElement, properties: string | string[], value: string): void => {
  const propertiesToUpdate = Array.isArray(properties) ? properties : [properties];

  for (const property of propertiesToUpdate) {
    propertyActions[property]?.(element, value);
  }
};

/**
 * Defines the actions to update element properties.
 */
const propertyActions: Record<string, (element: HTMLElement, value: string) => void> = {
  [TEXT_PROPERTY]: (element: HTMLElement, value: string) => {
    element.innerText = String(value);
  },

  [SRC_PROPERTY]: (element: HTMLElement, value: string) => {
    element.setAttribute(SRC_PROPERTY, String(value));
    element.removeAttribute(SRCSET_PROPERTY);
  },

  [SRCSET_PROPERTY]: (element: HTMLElement, value: string) => {
    element.setAttribute(SRCSET_PROPERTY, String(value));
    element.removeAttribute(SRC_PROPERTY);
  },

  [SIZES_PROPERTY]: (element: HTMLElement, value: string) => {
    element.setAttribute(SIZES_PROPERTY, String(value));
  },
};
