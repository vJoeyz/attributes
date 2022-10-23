/**
 * Waits for the passed Attributes to be loaded.
 * It awaits for them in a sequential order.
 *
 * @param attributeKeys All the Attribute keys that must be awaited, ordered by sequence.
 */
export const awaitAttributesLoad = async (...attributeKeys: string[]) => {
  for (const attributeKey of attributeKeys) {
    await window.fsAttributes[attributeKey]?.loading;
  }
};
