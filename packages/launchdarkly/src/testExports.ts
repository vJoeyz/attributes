/**
 * This script is only available in test environment
 */
import { initFlagElement } from './factory';

declare global {
  interface Window {
    fsLaunchDarkly: {
      initFlagElement: typeof initFlagElement;
    };
  }
}

window.fsLaunchDarkly = {
  initFlagElement,
};
