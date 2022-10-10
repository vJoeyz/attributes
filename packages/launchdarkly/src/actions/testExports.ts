/**
 * This script is only available in test environment
 */
import { showOrHideElement } from './showOrHideElement';
import { updateElementProperties } from './updateElementProperties';
import { updateElementProperty } from './updateElementProperty';

declare global {
  interface Window {
    fsLaunchDarkly: {
      showOrHideElement: typeof showOrHideElement;
      updateElementProperty: typeof updateElementProperty;
      updateElementProperties: typeof updateElementProperties;
    };
  }
}

window.fsLaunchDarkly = {
  showOrHideElement,
  updateElementProperty,
  updateElementProperties,
};
