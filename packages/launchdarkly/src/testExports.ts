/**
 * This script is only available in test environment
 */
import { hideLoader, initFlagElement } from './factory';

declare global {
  interface Window {
    fsLaunchDarkly: {
      initFlagElement: typeof initFlagElement;
      hideLoader: typeof hideLoader;
    };
  }
}

window.fsLaunchDarkly = {
  initFlagElement,
  hideLoader,
};
