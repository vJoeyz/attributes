import type { AttributesData } from '../utils/types';
import type { AttributeChangesets } from '$utils/types/changesets';

/**
 * Fetches the changesets of a specific Attribute package.
 *
 * @param attributeData The Attribute package data.
 *
 * @returns The changesets, if existing.
 */
export const getAttributeChangesets = async ({ baseSrc, changesetsSrc }: AttributesData[number]) => {
  try {
    // const response = await fetch(`${baseSrc}/${changesetsSrc}`);
    const response = await fetch(
      'https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsload@1.3.2-beta.0/changesets.json'
    );
    const changesets: AttributeChangesets = await response.json();

    return changesets;
  } catch (error) {
    return;
  }
};
