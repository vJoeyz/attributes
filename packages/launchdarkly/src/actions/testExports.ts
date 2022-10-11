/**
 * This script is only available in test environment
 */
import { updateElementProperty } from './properties';
import { showOrHideElement } from './show';

declare global {
  interface Window {
    fsLaunchDarkly: {
      showOrHideElement: typeof showOrHideElement;
      updateElementProperty: typeof updateElementProperty;
    };
  }
}

window.fsLaunchDarkly = {
  showOrHideElement,
  updateElementProperty,
};
