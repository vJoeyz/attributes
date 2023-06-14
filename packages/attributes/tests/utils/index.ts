import type { FsAttributeKey } from '@finsweet/attributes-utils';
import type { Page } from '@playwright/test';

/**
 * Wait for the attribute to be loaded in the current test page.
 * @param page
 * @param attributeKey
 */
export const awaitAttributeLoaded = async (page: Page, attributeKey: FsAttributeKey) => {
  return page.evaluate<Promise<unknown>, FsAttributeKey>(async (attributeKey) => {
    return new Promise((r) => {
      window.fsAttributes = window.fsAttributes || [];
      window.fsAttributes.push([attributeKey, r]);
    });
  }, attributeKey);
};
