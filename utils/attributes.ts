/**
 * Creates a dynamic attribute value.
 * @param value The static attribute value.
 * @returns A callback for generating new attribute values by index.
 */
export const createDynamicAttibuteValue = (value: string) => {
  return (index?: number): string => `${value}${index ? `-${index}` : ''}`;
};
