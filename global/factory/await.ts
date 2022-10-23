/**
 * Waits for the passed Attributes to be loaded.
 * It awaits for them in a sequential order.
 *
 * @param attributeKeys All the Attribute keys that must be awaited, ordered by sequence.
 */
export const awaitAttributesLoad = async (...attributeKeys: string[]) => {
  const loadResults = await Promise.all(
    attributeKeys.map((attributeKey) => window.fsAttributes[attributeKey]?.loading)
  );

  return loadResults;
};
