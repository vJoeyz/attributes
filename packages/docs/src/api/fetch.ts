import type { AttributesData } from '../utils/types';

/**
 * Fetches the changesets of a specific Attribute package.
 *
 * @param attributeData The Attribute package data.
 *
 * @returns The changesets, if existing.
 */
export const getAttributeReadme = async ({ baseSrc, readmeSrc }: AttributesData[number]) => {
  try {
    const response = await fetch(`${baseSrc}/${readmeSrc}`);

    const markdown: string = await response.text();

    return markdown;
  } catch (error) {
    return;
  }
};
