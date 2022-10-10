/**
 * This script is only available in test environment
 */
import { extractElementsByCategory } from './extractElementsByCategory';
import { showOrHideElement } from './showOrHideElement';
import { updateElementProperties } from './updateElementProperties';
import { updateElementProperty } from './updateElementProperty';

declare global {
  interface Window {
    fsLaunchDarkly: {
      showOrHideElement: typeof showOrHideElement;
      updateElementProperty: typeof updateElementProperty;
      updateElementProperties: typeof updateElementProperties;
      extractElementsByCategory: typeof extractElementsByCategory;
    };
  }
}

window.fsLaunchDarkly = {
  showOrHideElement,
  updateElementProperty,
  updateElementProperties,
  extractElementsByCategory,
};
